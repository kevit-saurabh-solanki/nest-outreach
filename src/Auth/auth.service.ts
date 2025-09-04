import { HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
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
            if (!findUser) throw new HttpException("User Not found", 404);

            const compareResult = await bcrypt.compare(password, findUser.password);
            if (compareResult) {
                const payload = { _id:findUser._id, email: findUser.email };
                console.log(payload);
                const token = this.jwtService.sign(payload, { secret: process.env.JWT_KEY });
                return token;
            }
            else {
                throw new HttpException("Unauthorized Access", 401);
            }

        }
        catch (err) {
            console.log(err);
        }
    }
}