import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class CampaignMessageSchema {

    @Prop({ required: true })
    campaignId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    message: string;

    @Prop({ required: false })
    imagePath?: string;

    @Prop({ required: true })
    targetTags: string[];

    @Prop({ required: true })
    contacts: mongoose.Schema.Types.ObjectId[];

    @Prop({ required: true, ref: "WorkspaceSchema" })
    workspaceId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, ref: "UsersSchema" })
    createdBy: mongoose.Schema.Types.ObjectId;

}

export const campaignMessageSchema = SchemaFactory.createForClass(CampaignMessageSchema);