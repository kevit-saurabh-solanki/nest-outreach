import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema() 
export class UsersSchema {

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: ['editor', 'viewer'] })
    role: string;

    @Prop({ required: true, ref: 'WorkspaceSchema' })
    workspaceId: string[];

    @Prop({ required: false })
    isAdmin?: boolean;

    @Prop({ required: true, type: Date, default: new Date().toISOString() })
    createdAt: string;

}

export const usersSchema = SchemaFactory.createForClass(UsersSchema);


 