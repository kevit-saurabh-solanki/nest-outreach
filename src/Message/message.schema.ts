import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class MessageSchema {

    @Prop({ required: true })
    title: string;

    @Prop({ required: true, enum: [ "text", "image" ] })
    messageType: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true, ref: "WorkspaceSchema" })
    workspaceId: number;

    @Prop({ required: true, ref: "UsersSchema" })
    createdBy: mongoose.Schema.Types.ObjectId;

}

export const messageSchema = SchemaFactory.createForClass(MessageSchema);

    // _id: mongoose.Schema.Types.ObjectId,
    // title: { type: String, required: true },
    // messageType: { type: String, required: true, enum: ["text", "image"] } ,
    // content: { type: String, required: true },
    // workspace_id: { type: Number, required: true, ref: "Workspace" },
    // createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "WorkspaceUser" },
    // createdAt: { type: Date, default: new Date().toISOString() }