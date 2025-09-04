import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UsersSchema } from "src/Users/users.schema";

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(@InjectModel(UsersSchema.name) private usersModel: Model<UsersSchema>) { }

  async canActivate(context: ExecutionContext,): Promise<boolean> {

    try {
      const req = context.switchToHttp().getRequest();
      const id = req.users._id;

      const findUser = await this.usersModel.findById(id);
      if (!findUser) throw new NotFoundException('User not found');
      const isAdmin = findUser.isAdmin;

      if (isAdmin === false || isAdmin === undefined) {
        console.log('No admin');
        throw new UnauthorizedException('Unauthorized');
      }

      return true;
    }
    catch (err) {
      console.log(err);
      return false;
    }
  }
}