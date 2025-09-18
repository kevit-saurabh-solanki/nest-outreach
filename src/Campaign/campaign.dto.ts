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
    @IsString({ each: true })
    targetTags: string[];

    @IsOptional()
    @IsString()
    description?: string;

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
    messageId?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    targetTags?: string[];

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    workspaceId?: string;
}
