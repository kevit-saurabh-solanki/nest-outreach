import { Body, Controller, HttpException, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./auth.dto";

@Controller('login')
export class AuthControl {
    constructor(private authService: AuthService) { }

    @Post('users')
    async loginUser(@Body() authDto: AuthDto) {
        const token = await this.authService.loginUser(authDto);
        if (!token?.token) throw new HttpException("Unauthorized Access", 401);
        return token;
    }

    @Post('admins')
    async loginAdmin(@Body() authDto: AuthDto) {
        const token = await this.authService.loginAdmin(authDto);
        if (!token?.token) throw new HttpException("Unauthorized Access", 401);
        return token;
    }
}