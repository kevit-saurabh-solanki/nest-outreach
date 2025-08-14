import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';

@Schema() 
export class UsersSchema {

    @Prop({ required: true, default: new mongoose.Types.ObjectId() })
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: ['editor', 'viewer'] })
    role: string;

    @Prop({ required: false, ref: 'WorkspaceSchema' })
    workspaceId?: number;

    @Prop({ required: false })
    isAdmin?: boolean

    @Prop({ required: true, type: Date, default: new Date().toISOString() })
    createdAt: string;

}

export const usersSchema = SchemaFactory.createForClass(UsersSchema);


 