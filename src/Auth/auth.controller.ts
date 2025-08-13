import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('login')
export class AuthControl {
    constructor(private authService: AuthService) {}

    @Post()
    loginUser()  {}
}