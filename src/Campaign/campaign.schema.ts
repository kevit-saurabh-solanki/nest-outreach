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

    @Prop({ required: true, enum: [ "draft", "success", "running" ], default: 'draft' })
    status: string;

    @Prop({ required: true, ref: "WorkspaceSchema" })
    workspaceId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, ref: "UsersSchema" })
    createdBy: mongoose.Schema.Types.ObjectId;

}

export const campaignSchema = SchemaFactory.createForClass(CampaignSchema);