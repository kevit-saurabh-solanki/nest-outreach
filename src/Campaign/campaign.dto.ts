import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

export class CampaignDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsNotEmpty()
    @IsArray()
    targetTags: string[];

    @IsNotEmpty()
    @IsString()
    status: string;

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
    status?: string;

    @IsOptional()
    @IsString()
    workspaceId?: string;

}