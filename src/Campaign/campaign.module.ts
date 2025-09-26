import { Module } from "@nestjs/common";
import { CampaignController } from "./campaign.controller";
import { CampaignService } from "./campaign.service";
import { MongooseModule } from "@nestjs/mongoose";
import { campaignSchema, Campaigns } from "./campaign.schema";
import { UsersSchema, usersSchema } from "src/Users/users.schema";
import { WorkspaceSchema, workspaceSchema } from "src/Workspace/workspace.schema";
import { AuthModule } from "src/Auth/auth.module";
import { contactsSchema, Contacts } from "src/Contacts/contacts.schema";
import { messageSchema, Messages } from "src/Message/message.schema";

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: Campaigns.name,
            schema: campaignSchema
        },
        {
            name: UsersSchema.name,
            schema: usersSchema
        },
        {
            name: WorkspaceSchema.name,
            schema: workspaceSchema
        },
        {
            name: Contacts.name,
            schema: contactsSchema
        },
        {
            name: Messages.name,
            schema: messageSchema
        }
    ]),
        AuthModule],
    controllers: [CampaignController],
    providers: [CampaignService]
})
export class CampaignModule { }