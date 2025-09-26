import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { messageSchema, Messages } from "./message.schema";
import { usersSchema, UsersSchema } from "src/Users/users.schema";
import { workspaceSchema, WorkspaceSchema } from "src/Workspace/workspace.schema";
import { MessageControl } from "./message.controller";
import { MessageService } from "./message.service";
import { AuthModule } from "src/Auth/auth.module";
import { RedisModule } from "src/Shared/cache/redis.module";
import { CacheService } from "src/Shared/cache/cache.service";

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: Messages.name,
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
        AuthModule,
        RedisModule],
    controllers: [MessageControl],
    providers: [MessageService, CacheService]
})
export class MessageModule { }