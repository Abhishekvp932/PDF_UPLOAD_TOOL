import { IUserPdfRepository } from "../../interface/userPdf/IuserPdfRepository";
import UserPdf from "../../models/implementation/userPdf.model";
import { IuserPdf } from "../../models/interface/IuserPdf";


export class UserPdfReposiory implements IUserPdfRepository {
    constructor(){}

    async create(data: Partial<IuserPdf>): Promise<IuserPdf | null> {
        return await UserPdf.create(data);
    }

    async findByUserId(userId: string,skip:number,limit:number): Promise<IuserPdf[]> {
        return await UserPdf.find({userId})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
    }
    async countAll(userId: string): Promise<number> {
        return await UserPdf.countDocuments({userId});
    }
}