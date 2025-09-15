import { Module } from "@nestjs/common";
import { CampaignMessageControl } from "./campMessage.controller";
import { CampaignMessageService } from "./campMessage.service";
import { MongooseModule } from "@nestjs/mongoose";
import { campaignMessageSchema, CampaignMessageSchema } from "./campMessage.schema";

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: CampaignMessageSchema.name,
            schema: campaignMessageSchema
        }
    ])],
    controllers: [CampaignMessageControl],
    providers: [CampaignMessageService]
})
export class CampaignMessageModule {}