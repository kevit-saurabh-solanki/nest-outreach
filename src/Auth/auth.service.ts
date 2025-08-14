import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuthDto } from "./auth.dto";
import { InjectModel } from "@nestjs/mongoose";
import { UsersSchema } from "src/Users/users.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(@InjectModel(UsersSchema.name) private usersModel: Model<UsersSchema>, private jwtService: JwtService) { }

    async loginUser({ email, password }: AuthDto) {
        try {
            const findUser = await this.usersModel.findOne({ email: email }).exec();
            if (!findUser) throw new NotFoundException;

            bcrypt.compare(password, findUser.password, (e, result) => {
                if (e) {
                    console.log(e);
                    throw new InternalServerErrorException;
                }

                if (result) {
                    const { password, isAdmin, ...payload } = findUser;
                    const token = this.jwtService.sign(payload);
                    return token;
                }
                else {
                    throw new UnauthorizedException;
                }
            })
        }
        catch(err) {
            console.log(err);
            throw new InternalServerErrorException;
        }
    }
}