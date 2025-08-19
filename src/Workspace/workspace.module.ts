import { Module } from "@nestjs/common";
import { WorkspaceControl } from "./workspace.controller";
import { WorkspaceService } from "./workspace.service";
import { MongooseModule } from "@nestjs/mongoose";
import { workspaceSchema, WorkspaceSchema } from "./workspace.schema";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: WorkspaceSchema.name,
            schema: workspaceSchema
        }
    ]),
    JwtModule.register({
        secret: process.env.JWT_KEY,
        signOptions: { expiresIn: "1h" } 
    })],
    controllers: [WorkspaceControl],
    providers: [WorkspaceService]
})
export class WorkspaceModule {}