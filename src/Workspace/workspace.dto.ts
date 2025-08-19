import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class WorkspaceDto {

    @IsNotEmpty()
    @IsString()
    _id: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

}

export class UpdateWorkspaceDto {

    @IsOptional()
    @IsString()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

}