import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { messageSchema, MessageSchema } from "./message.schema";
import { usersSchema, UsersSchema } from "src/Users/users.schema";
import { workspaceSchema, WorkspaceSchema } from "src/Workspace/workspace.schema";
import { MessageControl } from "./message.controller";
import { MessageService } from "./message.service";
import { AuthModule } from "src/Auth/auth.module";

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: MessageSchema.name,
            schema: messageSchema
        },
        {
            name: UsersSchema.name,
            schema: usersSchema
        },
        {
            name: WorkspaceSchema.name,
            schema: workspaceSchema
        }
    ]),
        AuthModule],
    controllers: [MessageControl],
    providers: [MessageService]
})
export class MessageModule { }