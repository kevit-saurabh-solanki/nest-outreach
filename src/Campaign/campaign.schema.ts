import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class CampaignSchema {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true })
    targetTags: string[];

    @Prop({ required: true, enum: [ "draft", "success", "running" ] })
    status: string;

    @Prop({ required: true, ref: "WorkspaceSchema" })
    workspaceId: string;

    @Prop({ required: true, ref: "UsersSchema" })
    createdBy: mongoose.Schema.Types.ObjectId;

}

export const campaignSchema = SchemaFactory.createForClass(CampaignSchema);