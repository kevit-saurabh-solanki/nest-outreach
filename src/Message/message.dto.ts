import { IsNotEmpty, IsNumber, IsString } from "class-validator";
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
    @IsNumber()
    workspaceId: number;

    @IsNotEmpty()
    createdBy: mongoose.Schema.Types.ObjectId;

}

export class UpdateMessageDto {

    @IsString()
    title: string;

    @IsString()
    messageType: string;

    @IsString()
    content: string;

    @IsNumber()
    workspaceId: number;

    createdBy: mongoose.Schema.Types.ObjectId;
}