import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { updateUserDto, UsersDto } from "./users.dto";
import mongoose from "mongoose";
import { AuthGuard } from "src/Auth/auth.guard";

@Controller('users')
export class UsersControl {
    constructor(private usersService: UsersService) { }

    @Post()
    // @UseGuards(AuthGuard)
    async addUser(@Body() userDto: UsersDto, @Req() req: any) {
        return this.usersService.addUser(userDto, req);
    }

    @Get()
    @UseGuards(AuthGuard)
    getUser(@Req() req: any) {
        return this.usersService.getAllUsers(req);
    }

    @Get('/:userId')
    @UseGuards(AuthGuard)
    getUserById(@Param('userId') userId: mongoose.Schema.Types.ObjectId, @Req() req: any) {
        return this.usersService.getUserById(userId, req);
    }

    @Delete('/:userId')
    @UseGuards(AuthGuard)
    deleteUserById(@Param('userId') userId: mongoose.Schema.Types.ObjectId, @Req() req: any) {
        return this.usersService.deleteUser(userId, req);
    }

    @Put('/:userId')
    @UseGuards(AuthGuard)
    editUserById(@Param('userId') userId: mongoose.Schema.Types.ObjectId, @Body() updateUserDto: updateUserDto, @Req() req: any) {
        return this.usersService.editUser(userId, updateUserDto, req);
    }
}