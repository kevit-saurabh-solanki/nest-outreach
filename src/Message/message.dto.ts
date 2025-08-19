import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import * as mongoose from 'mongoose'

export class MessageDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    messageType: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    workspaceId: string;

    @IsOptional()
    @IsString()
    createdBy?: mongoose.Schema.Types.ObjectId;

}

export class UpdateMessageDto {

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    messageType?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    workspaceId?: string;

    @IsString()
    @IsOptional()
    createdBy?: mongoose.Schema.Types.ObjectId;

}