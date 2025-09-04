import { Module } from "@nestjs/common";
import { WorkspaceControl } from "./workspace.controller";
import { WorkspaceService } from "./workspace.service";
import { MongooseModule } from "@nestjs/mongoose";
import { workspaceSchema, WorkspaceSchema } from "./workspace.schema";
import { AuthModule } from "src/Auth/auth.module";
import { UsersModule } from "src/Users/users.module";
import { usersSchema, UsersSchema } from "src/Users/users.schema";

@Module({
    imports: [AuthModule, UsersModule,
        MongooseModule.forFeature([
            {
                name: WorkspaceSchema.name,
                schema: workspaceSchema
            },
            {
                name: UsersSchema.name,
                schema: usersSchema
            },
        ]),
    ],
    controllers: [WorkspaceControl],
    providers: [WorkspaceService]
})
export class WorkspaceModule { }