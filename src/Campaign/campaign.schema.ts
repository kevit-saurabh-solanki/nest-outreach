import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class CampaignSchema {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, ref: "MessageSchema" })
    messageId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    targetTags: string[];

    @Prop({ required: true })
    content: string;

    @Prop({ required: true, enum: ["Text", "Text and Image"] })
    messageType: string;

    @Prop({ required: false })
    imagePath?: string;

    @Prop({ required: true, enum: ["draft", "success", "running"], default: 'draft' })
    status: string;

    @Prop({ required: true, ref: "WorkspaceSchema" })
    workspaceId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, ref: "UsersSchema" })
    createdBy: mongoose.Schema.Types.ObjectId;

    @Prop({ type: Object, default: undefined })
    launchedMessage?: {
        content: string;
        type: string;
        imagePath?: string;
    };

    @Prop({ type: [Object], default: undefined })
    launchedContacts?: {
        _id: string;
        name: string;
        phoneNumber: number;
    }[];

    @Prop()
    launchedAt?: Date;

}

export const campaignSchema = SchemaFactory.createForClass(CampaignSchema);