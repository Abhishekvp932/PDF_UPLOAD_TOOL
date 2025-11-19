import mongoose, { mongo, Schema } from "mongoose";
import { IUser } from "../interface/IUser";

const userSchema = new Schema<IUser>({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
},{timestamps:true})


const User = mongoose.model<IUser>('User',userSchema);

export default User;

