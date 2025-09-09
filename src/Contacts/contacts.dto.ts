import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

export class ContactsDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    phoneNumber: number

    @IsNotEmpty()
    @IsArray()
    tags: string[];

    @IsNotEmpty()
    @IsString()
    workspaceId: string;

}

export class UpdateContactsDto {

    @IsOptional()
    @IsString()
    name?: string;

    @IsNumber()
    @IsOptional()
    phoneNumber?: number

    @IsOptional()
    @IsArray()
    tags?: string[];

    @IsOptional()
    @IsString()
    workspaceId?: string;

}
