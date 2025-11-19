import mongoose  from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


const connectDB = async ():Promise<void>=>{
    try {
        const mongoURL = process.env.MONGO_URI;
        if(!mongoURL){
            throw new Error('Mongo db url is not defin .env file');
        }
        const conn = await mongoose.connect(mongoURL)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        
    }
}

export default connectDB;