import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./auth.dto";

@Controller('login')
export class AuthControl {
    constructor(private authService: AuthService) {}

    @Post()
    loginUser(@Body() authDto: AuthDto)  {
       const token = this.authService.loginUser(authDto);
       return { access_token: token };
    }
}