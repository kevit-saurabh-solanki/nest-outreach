import { Body, Controller, HttpException, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./auth.dto";

@Controller('login')
export class AuthControl {
    constructor(private authService: AuthService) {}

    @Post()
    async loginUser(@Body() authDto: AuthDto)  {
       const token = await this.authService.loginUser(authDto);
       if (!token?.token) throw new HttpException("Unauthorized Access", 401);
       return token;
    }
}