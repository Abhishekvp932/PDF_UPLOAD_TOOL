import mongoose, { Types } from "mongoose";

export interface IuserPdf {
    _id:string |  mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    fileName:string;
    filePath:string;
    pages:number[];
    createdAt:Date;
    updatedAt:Date;
}