import path from "path";
import fs from 'fs'
import { IUserRepository } from "../../interface/user/IUserRepository";
import { IUserService } from "../../interface/user/IUserService";
import { IUserPdfRepository } from "../../interface/userPdf/IuserPdfRepository";
import { extractPages } from "../../utils/extractPages";
import { generateAccessToken, generateRefreshToken, TokenPayload } from "../../utils/jwt";
import { buffer } from "stream/consumers";
import { Types } from "mongoose";
import { UserPdf, UserPdfDTO, userType } from "../../types/userType";


export class UserService implements IUserService{
    constructor(private _userRepository:IUserRepository,
       private  _userPdfRepository:IUserPdfRepository
    ){}
    async signup(email: string, password: string): Promise<{ msg: string; }> {
        const userExists = await this._userRepository.findByEmail(email);
        if(userExists){
            throw new Error('User Already Exists');
        }
        const newUser = {
            email,
            password,
        }
        await this._userRepository.create(newUser);
        return {msg: 'Registration Completed'};
    }

    async login(email: string, password: string): Promise<{msg:string,accessToken: string,refreshToken: string,user:userType}> {
        const user = await this._userRepository.findByEmail(email);

        if(!user){
            throw new Error('User not found');
        }
        if(user.password !== password){
            throw new Error('Incorrect Password')
        }

        const payload : TokenPayload = {
            id:user._id.toString(),
            email:user.email,
        }
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {msg:'login success',accessToken,refreshToken,user:payload}
    }

    async extract(fileBuffer: Buffer, page: number[],userId:string): Promise<Uint8Array> {
        if(!fileBuffer){
            throw new Error('PDF file missing');
        }
        if(!page || page.length === 0){
            throw new Error('Pages Array is Empty')
        }
        const pdfBytes = await extractPages(fileBuffer,page);

        const userFolder = path.join('uploads',userId);

        if(!fs.existsSync(userFolder)){
            fs.mkdirSync(userFolder,{recursive: true})
        }

        const fileName = `pdf_${Date.now()}.pdf`;
        const filePath = path.join(userFolder,fileName);
        fs.writeFileSync(filePath,Buffer.from(pdfBytes));

        const newUserPdf = {
            userId:new Types.ObjectId(userId as string),
            fileName,
            filePath,
            pages:page
        }
        console.log('new User pdf',newUserPdf);
        await this._userPdfRepository.create(newUserPdf);
        return pdfBytes;
    } 

    async getHistory(userId: string,page:number,limit:number): Promise<UserPdfDTO> {
        const skip = (page - 1) * limit;
        
        const [userPdfList,total] = await Promise.all([
             this._userPdfRepository.findByUserId(userId,skip,limit),
             this._userPdfRepository.countAll(userId),
        ]);
         const userPdf:UserPdf[] = userPdfList.map((p)=>{
            return {
                _id:p._id.toString(),
                userId:p.userId.toString(),
                fileName:p.fileName,
                filePath:p.filePath,
                pages:p.pages,
                createdAt:p.createdAt,
                updated:p.updatedAt,
            }
         })
        return {pdfHistory:userPdf,total};
    }
    async downloadPdf(pdfId: string): Promise<{ filePath: string; fileName: string; }> {
        const pdfRecord = await this._userPdfRepository.findById(pdfId);
        if(!pdfRecord){
         throw new Error('PDf not found'); 
        }
        return {
            filePath:pdfRecord.filePath,
            fileName:pdfRecord.fileName,
        };
    };
}