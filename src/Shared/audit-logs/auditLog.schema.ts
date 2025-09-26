import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class AuditLogSchema {

    @Prop({ required: true, ref: 'UsersSchema' })
    actionTakenBy: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, default: Date.now().toString() })
    actionDoneAt: Date;

    @Prop({ required: true, refPath: 'resource' })
    actionTakenOn: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    action: string;

    @Prop({ required: true })
    resource: string;

    @Prop({ required: true, ref: 'WorkspaceSchema' })
    workspaceId: mongoose.Schema.Types.ObjectId;
}

export const auditLogSchema = SchemaFactory.createForClass(AuditLogSchema);