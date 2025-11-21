import { IUserRepository } from "../../interface/user/IUserRepository";
import User from "../../models/implementation/user.model";
import { IUser } from "../../models/interface/IUser";

export class UserRepository implements IUserRepository{
    constructor(){}

    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({email})
    }

    async create(data: Partial<IUser>): Promise<IUser | null> {
         return await User.create(data);
    }
}