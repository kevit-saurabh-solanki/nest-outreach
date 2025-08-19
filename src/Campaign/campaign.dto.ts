import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
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

    @IsNumber()
    @IsNotEmpty()
    workspaceId: number;

    @IsNotEmpty()
    createdBy: mongoose.Schema.Types.ObjectId;
}

export class UpdateCampaignDto {

    @IsString()
    name: string;

    @IsString()
    message: string;

    @IsArray()
    targetTags: string[];

    @IsString()
    status: string;

    @IsNumber()
    workspaceId: number;

    createdBy: mongoose.Schema.Types.ObjectId;
}