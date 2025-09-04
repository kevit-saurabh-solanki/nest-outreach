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

}