import mongoose, { Types } from "mongoose";

export interface IuserPdf {
    userId: mongoose.Types.ObjectId;
    fileName:string;
    filePath:string;
    pages:number[];
    createdAt:Date;
    updatedAt:Date;
}