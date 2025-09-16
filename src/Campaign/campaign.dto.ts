import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

export class CampaignDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    messageId: string;

    @IsNotEmpty()
    @IsArray()
    targetTags: string[];

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    messageType: string;

    @IsOptional()
    @IsString()
    imagePath?: string;

    @IsNotEmpty()
    @IsString()
    workspaceId: string;

}

export class UpdateCampaignDto {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    message?: string;

    @IsOptional()
    @IsArray()
    targetTags?: string[];

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    messageType?: string;

    @IsOptional()
    @IsString()
    imagePath?: string;

    @IsOptional()
    @IsString()
    workspaceId?: string;

}