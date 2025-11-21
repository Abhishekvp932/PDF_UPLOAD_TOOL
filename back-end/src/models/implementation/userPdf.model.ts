import mongoose, { Schema } from "mongoose";
import { IuserPdf } from "../interface/IuserPdf";

const userPdfSchema = new Schema<IuserPdf>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    fileName:{
        type:String,
        required:true,
    },
    filePath:{
        type:String,
        required:true,
    },
    pages:{
        type:[Number],
        required:true,
    }
},{timestamps:true});

const UserPdf = mongoose.model<IuserPdf>("UserPdf",userPdfSchema);
export default UserPdf;