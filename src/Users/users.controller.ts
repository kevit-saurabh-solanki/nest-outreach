import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { updateUserDto, UsersDto } from "./users.dto";
import mongoose, { mongo } from "mongoose";
import { AuthGuard } from "src/Auth/auth.guard";
import { AdminGuard } from "src/Auth/admin.guard";

@Controller('users')
export class UsersControl {
    constructor(private usersService: UsersService) { }

    @Post()
    @UseGuards(AuthGuard, AdminGuard)
    async addUser(@Body() userDto: UsersDto) {
        return this.usersService.addUser(userDto);
    }

    @Get()
    @UseGuards(AuthGuard, AdminGuard)
    getUser() {
        return this.usersService.getAllUsers();
    }

    @Get('workspace/:workspaceId')
    @UseGuards(AuthGuard, AdminGuard)
    getUsersByWorkspaceId(@Param('workspaceId') workspaceId: string) {
        return this.usersService.getUsersByWorkspaceId(workspaceId);
    }

    @Get('/:userId')
    @UseGuards(AuthGuard)
    getUserById(@Param('userId') userId: mongoose.Schema.Types.ObjectId) {
        return this.usersService.getUserById(userId);
    }

    @Delete('/:userId')
    @UseGuards(AuthGuard, AdminGuard)
    deleteUserById(@Param('userId') userId: mongoose.Schema.Types.ObjectId) {
        return this.usersService.deleteUser(userId);
    }

    @Put('/:userId')
    @UseGuards(AuthGuard, AdminGuard)
    editUserById(@Param('userId') userId: mongoose.Schema.Types.ObjectId, @Body() updateUserDto: updateUserDto) {
        return this.usersService.editUser(userId, updateUserDto);
    }
}