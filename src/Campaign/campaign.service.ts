import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CampaignSchema } from "./campaign.schema";
import { Model } from "mongoose";
import { UsersSchema } from "src/Users/users.schema";
import { WorkspaceSchema } from "src/Workspace/workspace.schema";
import mongoose from 'mongoose';
import { CampaignDto, UpdateCampaignDto } from "./campaign.dto";

@Injectable()
export class CampaignService {
    constructor(@InjectModel(CampaignSchema.name) private campaignModel: Model<CampaignSchema>,
        @InjectModel(UsersSchema.name) private userModel: Model<UsersSchema>,
        @InjectModel(WorkspaceSchema.name) private workspaceModel: Model<WorkspaceSchema>) { }

    //get all campaign--------------------------------------------------------
    async getAllCampaign() {
        try {
            const allCampaign = await this.campaignModel.find({}).exec();
            return allCampaign;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //get campaign by Id--------------------------------------------------------
    async getCampaignById(campaignId: mongoose.Schema.Types.ObjectId) {
        try {
            const singleCampaign = await this.campaignModel.findOne({ _id: campaignId }).exec();
            if (!singleCampaign) throw new NotFoundException("Campaign not found");
            return singleCampaign;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //add campaign----------------------------------------------------------------
    async addCampaign(campaignDto: CampaignDto, req: any) {
        try {
            const role = req.users.role;
            if (role === "viewer") throw new UnauthorizedException;
            const findUser = await this.userModel.findById(campaignDto.createdBy).exec();
            if (!findUser) throw new NotFoundException("User not found");
            const findWorkspace = await this.workspaceModel.findById(campaignDto.workspaceId).exec();
            if (!findWorkspace) throw new NotFoundException("Workspace not found");

            const newCampaign = new this.campaignModel(campaignDto);
            const savedCampaign = await newCampaign.save();
            return savedCampaign;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //delete campaign by ID----------------------------------------------------------
    async deleteCampaign(campaignId: mongoose.Schema.Types.ObjectId, req: any) {
        try {
            const role = req.users.role;
            if (role === "viewer") throw new UnauthorizedException;

            const deleteCampaign = await this.campaignModel.findOneAndDelete({ _id: campaignId }).exec();
            if (!deleteCampaign) throw new NotFoundException("campaign not found");
            return deleteCampaign;
        }
        catch (err) {
            console.log(err);
            return (err);
        }
    }

    //edit campaign
    async editCampaign(campaignId: mongoose.Schema.Types.ObjectId, updateCampaign: UpdateCampaignDto, req: any) {
        try {
            const role = req.users.role;
            if (role === "viewer") throw new UnauthorizedException;

            const editcampaign = await this.campaignModel.findOneAndUpdate({ _id: campaignId }, { ...updateCampaign }, { returnDocument: "after" }).exec();
            if (!editcampaign) throw new NotFoundException("campaign not found");
            return editcampaign;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }
}