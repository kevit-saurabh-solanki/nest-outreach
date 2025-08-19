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

    @IsOptional()
    createdBy?: mongoose.Schema.Types.ObjectId;
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

    @IsOptional()
    @IsString()
    createdBy?: mongoose.Schema.Types.ObjectId;
}