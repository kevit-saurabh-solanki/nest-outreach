import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

export class ContactsDto {

    _id: mongoose.Schema.Types.ObjectId;

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

    @IsOptional()
    @IsString()
    createdBy?: mongoose.Schema.Types.ObjectId;

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

    @IsOptional()
    @IsString()
    createdBy?: mongoose.Schema.Types.ObjectId;
    
}
