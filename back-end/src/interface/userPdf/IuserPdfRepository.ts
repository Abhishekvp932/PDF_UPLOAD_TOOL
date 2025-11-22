import { IuserPdf } from "../../models/interface/IuserPdf";

export interface IUserPdfRepository {
    create(data:Partial<IuserPdf>):Promise<IuserPdf | null>;
    findByUserId(userId:string,skip:number,limit:number):Promise<IuserPdf[]>;
    countAll(userId:string):Promise<number>;
    findById(pdfId:string):Promise<IuserPdf | null>;

}