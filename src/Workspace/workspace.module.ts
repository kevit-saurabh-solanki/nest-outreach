import { Module } from "@nestjs/common";
import { WorkspaceControl } from "./workspace.controller";
import { WorkspaceService } from "./workspace.service";
import { MongooseModule } from "@nestjs/mongoose";
import { workspaceSchema, WorkspaceSchema } from "./workspace.schema";
import { AuthModule } from "src/Auth/auth.module";

@Module({
    imports: [AuthModule,
        MongooseModule.forFeature([
            {
                name: WorkspaceSchema.name,
                schema: workspaceSchema
            }
        ]),

    ],
    controllers: [WorkspaceControl],
    providers: [WorkspaceService]
})
export class WorkspaceModule { }