import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class WorkspaceSchema {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

}

export const workspaceSchema = SchemaFactory.createForClass(WorkspaceSchema);
