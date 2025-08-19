import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class WorkspaceSchema {

    @Prop({ required: true })
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, default: new Date().toISOString() })
    createdAt: string;
}

export const workspaceSchema = SchemaFactory.createForClass(WorkspaceSchema);
