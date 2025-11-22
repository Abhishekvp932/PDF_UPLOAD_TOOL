import { NextFunction, Request, Response } from "express";

export interface IUserController {
  signup(req:Request,res:Response,next:NextFunction):Promise<void>;
  login(req:Request,res:Response,next:NextFunction):Promise<void>;
  extractPdf(req:Request,res:Response,next:NextFunction):Promise<void>;
  getHistory(req:Request,res:Response,next:NextFunction):Promise<void>;
  downloadPdf(req:Request,res:Response,next:NextFunction):Promise<void>;
}