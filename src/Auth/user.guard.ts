import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Observable } from 'rxjs';
import { UsersSchema } from 'src/Users/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserGuard implements CanActivate {

  constructor(@InjectModel(UsersSchema.name) private usersModel: Model<UsersSchema>) {}

  async canActivate(context: ExecutionContext,): Promise<boolean> {

    try {
      const req = context.switchToHttp().getRequest();
      const id = req.users._id;

      const findUser = await this.usersModel.findById(id);
      if (!findUser) throw new NotFoundException('User not found')
      const role = findUser.role;

      if (role === 'viewer' || role === undefined) {
        console.log('role viewer or admin');
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
