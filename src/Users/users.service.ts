import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UsersSchema } from "./users.schema";
import { Model } from "mongoose";

@Injectable()
export class UsersService {
    constructor(@InjectModel(UsersSchema.name) private usersModel: Model<UsersSchema>) {}

}