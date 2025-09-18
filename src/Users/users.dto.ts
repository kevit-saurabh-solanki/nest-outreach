import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsArray } from "class-validator";
import mongoose from "mongoose";


export class UsersDto {

    @IsEmail()
    @IsNotEmpty()  
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    role?: string;

    @IsOptional()
    @IsBoolean()  
    isAdmin?: boolean;

    @IsOptional()
    workspaceId: mongoose.Schema.Types.ObjectId;

}

export class updateUserDto {

    @IsOptional()
    @IsEmail() 
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    workspaceId?: string;
    
}