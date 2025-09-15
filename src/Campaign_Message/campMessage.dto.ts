import { IsNotEmpty, IsString, IsArray, IsOptional } from "class-validator";

export class CampaignMessageDto {

    @IsNotEmpty()
    @IsString()
    campaignId: string;

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsOptional()
    @IsString()
    imagePath?: string;

    @IsNotEmpty()
    @IsArray()
    targetTags: string[];

    @IsNotEmpty()
    @IsString()
    contacts: string[];

}