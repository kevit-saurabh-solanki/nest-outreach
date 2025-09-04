import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {

    const req = context.switchToHttp().getRequest();
    const isAdmin = req.users.isAdmin;

    if (isAdmin === false || isAdmin === undefined) {
      console.log('No admin');
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}