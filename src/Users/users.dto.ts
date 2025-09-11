import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsArray } from "class-validator";


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
    workspaceId?: string[];

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
    workspaceId?: string[];
    
}