import { IsEmail, IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from "class-validator";
import mongoose from "mongoose";

export class UsersDto {

    _id: mongoose.Schema.Types.ObjectId;

    @IsEmail()
    @IsNotEmpty()  
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    // @IsNumber()
    // @IsNotEmpty() 
    @IsOptional()
    workspaceId?: number;

    @IsOptional()
    @IsBoolean()  
    isAdmin?: boolean

}

export class updateUserDto {

    @IsEmail() 
    email: string;

    @IsString()
    password: string;

    @IsString()
    role: string;

    @IsNumber()
    workspaceId: number;
    
}