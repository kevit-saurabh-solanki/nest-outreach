import { Module } from "@nestjs/common";
import { CampaignController } from "./campaign.controller";
import { CampaignService } from "./campaign.service";
import { MongooseModule } from "@nestjs/mongoose";
import { campaignSchema, CampaignSchema } from "./campaign.schema";
import { UsersSchema, usersSchema } from "src/Users/users.schema";
import { WorkspaceSchema, workspaceSchema } from "src/Workspace/workspace.schema";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: CampaignSchema.name,
            schema: campaignSchema
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
    JwtModule.register({
        secret: "secret",
        signOptions: { expiresIn: "1h" }
    })],
    controllers: [CampaignController],
    providers: [CampaignService]
})
export class CampaignModule { }