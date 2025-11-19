import { Request,Response } from "express";
import { IUserController } from "../../interface/user/IUserController";
import { HttpStatus } from "../../utils/HttpStatus";

export class UserController implements IUserController {
    constructor(){}
    async signup(req: Request, res: Response): Promise<void> {
        try {
            console.log('user signup ....');
        } catch (error) {
           const err = error as Error;
           res.status(HttpStatus.CREATED).json({msg:err.message});
           return;
        }
    }
}