import { Controller } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersControl {
    constructor(private usersService: UsersService) {}


}