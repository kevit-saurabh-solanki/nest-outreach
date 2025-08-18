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
    workspaceId: number;

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

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGEyZjU1NzE5ODU0YWY4YjUxYmU0YmMiLCJ1c2VybmFlbSI6IndpbGxAa2V2aXQuaW8iLCJyb2xlIjoidmlld2VyIiwiaWF0IjoxNzU1NTEwMzg4LCJleHAiOjE3NTU1MTM5ODh9.LdIgG-YPwBjH3GwQujxIZyZXk1K37DHgaGd0TK4Aqt0