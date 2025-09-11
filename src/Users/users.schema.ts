import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true }) 
export class UsersSchema {

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false, enum: ['editor', 'viewer'] })
    role?: string;

    @Prop({ required: false, ref: 'WorkspaceSchema' })
    workspaceId?: mongoose.Schema.Types.ObjectId[];

    @Prop({ required: false })
    isAdmin?: boolean;

}

export const usersSchema = SchemaFactory.createForClass(UsersSchema);


 