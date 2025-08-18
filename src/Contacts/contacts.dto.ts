import { IsArray, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import mongoose from "mongoose";

export class ContactsDto {

    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @MinLength(10)
    @MaxLength(10)
    phoneNumber: number

    @IsNotEmpty()
    @IsArray()
    tags: string[];

    @IsNotEmpty()
    @IsNumber()
    workspaceId: number;

    @IsNotEmpty()
    @IsString()
    createdBy: mongoose.Schema.Types.ObjectId;

}

export class UpdateContactsDto {

    @IsString()
    name: string;

    @IsNumber()
    @MinLength(10)
    @MaxLength(10)
    phoneNumber: number

    @IsArray()
    tags: string[];

    @IsNumber()
    workspaceId: number;

    @IsString()
    createdBy: mongoose.Schema.Types.ObjectId;
    
}

//  _id: mongoose.Schema.Types.ObjectId,
//     name: { type: String, required: true },
//     phoneNumber: { type: Number, required: true },
//     tags: { type: Array, required: true },
//     workspace_id: { type: Number, ref: 'Workspace', required: true },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkspaceUser', required: true }