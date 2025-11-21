import { IuserPdf } from "../../models/interface/IuserPdf";
import { UserPdfDTO, userType } from "../../types/userType"

export interface IUserService {
    signup(email:string,password:string):Promise<{msg:string}>
    login(email:string,password:string):Promise<{msg:string,accessToken: string,refreshToken: string,user:userType}>
    extract(fileBuffer:Buffer,page:number[],userId:string):Promise<Uint8Array>;
    getHistory(userId:string,page:number,limit:number):Promise<UserPdfDTO>;
}