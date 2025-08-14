import { Module } from "@nestjs/common";
import { WorkspaceControl } from "./workspace.controller";
import { WorkspaceService } from "./workspace.service";
import { MongooseModule } from "@nestjs/mongoose";
import { workspaceSchema, WorkspaceSchema } from "./workspace.schema";

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: WorkspaceSchema.name,
            schema: workspaceSchema
        }
    ])],
    controllers: [WorkspaceControl],
    providers: [WorkspaceService]
})
export class WorkspaceModule {}