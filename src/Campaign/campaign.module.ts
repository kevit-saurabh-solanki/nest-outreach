import { Module } from "@nestjs/common";
import { CampaignController } from "./campaign.controller";
import { CampaignService } from "./campaign.service";
import { MongooseModule } from "@nestjs/mongoose";
import { campaignSchema, CampaignSchema } from "./campaign.schema";
import { UsersSchema, usersSchema } from "src/Users/users.schema";
import { WorkspaceSchema, workspaceSchema } from "src/Workspace/workspace.schema";
import { AuthModule } from "src/Auth/auth.module";
import { contactsSchema, ContactsSchema } from "src/Contacts/contacts.schema";
import { messageSchema, MessageSchema } from "src/Message/message.schema";

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
        },
        {
            name: ContactsSchema.name,
            schema: contactsSchema
        },
        {
            name: MessageSchema.name,
            schema: messageSchema
        }
    ]),
        AuthModule],
    controllers: [CampaignController],
    providers: [CampaignService]
})
export class CampaignModule { }