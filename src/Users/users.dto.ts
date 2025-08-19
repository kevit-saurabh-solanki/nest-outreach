import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsArray } from "class-validator";


export class UsersDto {

    @IsEmail()
    @IsNotEmpty()  
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsArray()
    @IsNotEmpty() 
    workspaceId: string[];

    @IsOptional()
    @IsBoolean()  
    isAdmin?: boolean;

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
    @IsArray()
    workspaceId?: string[];
    
}