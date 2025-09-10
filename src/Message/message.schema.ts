import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class MessageSchema {

    @Prop({ required: true })
    title: string;

    @Prop({ required: true, enum: [ "Text", "Text and Image" ] })
    messageType: string;

    @Prop({ required: false })
    imagePath?: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true, ref: "WorkspaceSchema" })
    workspaceId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, ref: "UsersSchema" })
    createdBy: mongoose.Schema.Types.ObjectId;
}

export const messageSchema = SchemaFactory.createForClass(MessageSchema);
