import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class ContactsSchema {

    @Prop({ required: true, default: new mongoose.Types.ObjectId() })
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, minLength: 10, maxLength: 10 })
    phoneNumber: number;

    @Prop({ required: true })
    tags: string[];

    @Prop({ required: true, ref: 'WorkspaceSchema' })
    workspaceId: number

    @Prop({ required: true, ref: 'UsersSchema' })
    createdBy: mongoose.Schema.Types.ObjectId;

}

export const contactsSchema = SchemaFactory.createForClass(ContactsSchema);

//  _id: mongoose.Schema.Types.ObjectId,
//     name: { type: String, required: true },
//     phoneNumber: { type: Number, required: true },
//     tags: { type: Array, required: true },
//     workspace_id: { type: Number, ref: 'Workspace', required: true },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkspaceUser', required: true }