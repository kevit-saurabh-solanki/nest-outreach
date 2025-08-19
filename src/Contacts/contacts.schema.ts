import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class ContactsSchema {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, minLength: 10, maxLength: 10 })
    phoneNumber: number;

    @Prop({ required: true })
    tags: string[];

    @Prop({ required: true, ref: 'WorkspaceSchema' })
    workspaceId: string;

    @Prop({ required: true, ref: 'UsersSchema' })
    createdBy: mongoose.Schema.Types.ObjectId;

}

export const contactsSchema = SchemaFactory.createForClass(ContactsSchema);
