import express, { Application } from "express";
import cookieParser from 'cookie-parser';
import connectdb from "./config/db";
import cors from "cors";
import userRouter from './routes/user.route';
import { errorHandler } from "./middleware/errorHandlerMiddleware";
const app: Application = express();

const corsOperation = {
  origin: "http://localhost:5173",
  credentials: true ,
};

const PORT = 5000;
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOperation));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use('/api/user',userRouter);
app.use(errorHandler);
connectdb();
app.listen(PORT, () => {
  console.log(`server is running ${PORT}`);
});
