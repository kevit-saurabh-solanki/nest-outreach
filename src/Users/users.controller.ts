import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { updateUserDto, UsersDto } from "./users.dto";
import mongoose from "mongoose";

@Controller('users')
export class UsersControl {
    constructor(private usersService: UsersService) {}

    @Post()
    addUser(@Body() userDto: UsersDto) {
        return this.usersService.addUser(userDto);
    }

    @Get()
    getUser() {
        return this.usersService.getAllUsers();
    }

    @Get('/:userId')
    getUserById(@Param('userId') userId: mongoose.Schema.Types.ObjectId) {
        return this.usersService.getUserById(userId);
    }

    @Delete('/:userId')
    deleteUserById(@Param('userId') userId: mongoose.Schema.Types.ObjectId) {
        return this.usersService.deleteUser(userId);
    }

    @Put('/:userId')
    editUserById(@Param('userId') userId: mongoose.Schema.Types.ObjectId, @Body() updateUserDto: updateUserDto) {
        return this.usersService.editUser(userId, updateUserDto);
    }
}