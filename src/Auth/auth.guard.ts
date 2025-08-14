import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const req: Request = context.switchToHttp().getRequest();

            const token = req.headers.authorization?.split(" ")[1];
            if (!token) throw new UnauthorizedException;

            const payload = this.jwtService.verify(token);
            req["users"] = payload;
        }
        catch(err) {
            console.log(err);
            throw new InternalServerErrorException;
        }

        return true;
    }
}