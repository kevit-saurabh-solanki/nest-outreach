import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CampaignMessageSchema } from "./campMessage.schema";
import { Model } from "mongoose";

@Injectable()
export class CampaignMessageService {

    constructor(@InjectModel(CampaignMessageSchema.name) private campMessage: Model<CampaignMessageSchema>) {}

    async launchCampaign() {
        
    }
}