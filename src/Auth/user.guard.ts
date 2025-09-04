import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {

    const req = context.switchToHttp().getRequest();
    const role = req.users.role;

    if (role === 'viewer') {
      console.log('role viewer');
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
