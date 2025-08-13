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

    @IsNumber()
    @IsNotEmpty() 
    workspace_id: number;

    @IsOptional()
    @IsBoolean()  
    isAdmin?: boolean

}