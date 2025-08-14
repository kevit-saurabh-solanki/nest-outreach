import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class WorkspaceDto {

    @IsNotEmpty()
    @IsNumber()
    _id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

}

export class UpdateWorkspaceDto {

    @IsString()
    name: string;

    @IsString()
    description: string;

}