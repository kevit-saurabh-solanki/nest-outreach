import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { usersSchema, UsersSchema } from "./users.schema";
import { UsersControl } from "./users.controller";
import { UsersService } from "./users.service";
import { workspaceSchema, WorkspaceSchema } from "src/Workspace/workspace.schema";
import { AuthModule } from "src/Auth/auth.module";

@Module({
    imports: [UsersSchema,
        MongooseModule.forFeature([
            {
                name: UsersSchema.name,
                schema: usersSchema
            },
            {
                name: WorkspaceSchema.name,
                schema: workspaceSchema
            }
        ]),
        AuthModule
    ],
    controllers: [UsersControl],
    providers: [UsersService]
})
export class UsersModule { }