import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CampaignSchema } from "./campaign.schema";
import { Model } from "mongoose";
import { UsersSchema } from "src/Users/users.schema";
import { WorkspaceSchema } from "src/Workspace/workspace.schema";
import mongoose from 'mongoose';
import { CampaignDto, UpdateCampaignDto } from "./campaign.dto";
import { ContactsSchema } from "src/Contacts/contacts.schema";

interface RecentCampaign {
    name: string;
    targetTags: string[];
    createdAt: Date;
    status: string;
}

@Injectable()
export class CampaignService {
    constructor(@InjectModel(CampaignSchema.name) private campaignModel: Model<CampaignSchema>,
        @InjectModel(UsersSchema.name) private userModel: Model<UsersSchema>,
        @InjectModel(WorkspaceSchema.name) private workspaceModel: Model<WorkspaceSchema>,
        @InjectModel(ContactsSchema.name) private contactsModel: Model<ContactsSchema>) { }

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
            const singleCampaign = await this.campaignModel.findOne({ _id: campaignId }).populate(["workspaceId name", "createdBy email", "messageId title"]).exec();
            if (!singleCampaign) throw new NotFoundException("Campaign not found");
            return singleCampaign;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //add campaign----------------------------------------------------------------
    async addCampaign({ ...campaignDto }: CampaignDto, req: any) {
        try {
            const findWorkspace = await this.workspaceModel.findById(campaignDto.workspaceId).exec();
            if (!findWorkspace) throw new NotFoundException("Workspace not found");

            const newCampaign = new this.campaignModel({ createdBy: req.users._id, ...campaignDto });
            const savedCampaign = await newCampaign.save();
            return savedCampaign;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //delete campaign by ID----------------------------------------------------------
    async deleteCampaign(campaignId: mongoose.Schema.Types.ObjectId) {
        try {
            const deleteCampaign = await this.campaignModel.findOneAndDelete({ _id: campaignId }).exec();
            if (!deleteCampaign) throw new NotFoundException("campaign not found");
            return deleteCampaign;
        }
        catch (err) {
            console.log(err);
            return (err);
        }
    }

    //edit campaign---------------------------------------------------------------------------------------------
    async editCampaign(campaignId: mongoose.Schema.Types.ObjectId, { messageType, imagePath, ...updateCampaign }: UpdateCampaignDto) {
        try {
            const findCampaign = await this.campaignModel.findById(campaignId);
            if (!findCampaign) throw new NotFoundException('campaign not found');
            if (findCampaign.status === 'success') throw new BadRequestException('Launched Campaign Cannot be edited');

            const editCampaign = await this.campaignModel.findOneAndUpdate(
                { _id: campaignId },
                messageType === 'Text'
                    ? {
                        ...updateCampaign,
                        messageType,
                        $unset: { imagePath: 1 },   // 👈 directly unset
                    }
                    : {
                        ...updateCampaign,
                        messageType,
                        ...(imagePath && { imagePath }), // only set if provided
                    },
                { new: true }
            );
            if (!editCampaign) throw new NotFoundException('campaign not found');
            return editCampaign;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    //get campaign by workspaceId--------------------------------------------------------------------------------------------------------
    async getCampaignByWorkspace(workspaceId: string) {
        const campaigns = await this.campaignModel.find({ workspaceId }).exec();
        if (!campaigns) throw new NotFoundException('No campaigns found for this workspace');
        return campaigns;
    }

    //get campaigns per day----------------------------------------------------------------------------------------------------------
    async getLaunchedCampaignsPerDay(start: string, end: string, workspaceId: string) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);

        const results = await this.campaignModel.aggregate([
            {
                $match: {
                    status: 'success',           // only launched campaigns
                    workspaceId: new mongoose.Types.ObjectId(workspaceId),
                    launchedAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$launchedAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        return results.map(r => ({
            date: r._id,
            count: r.count
        }));
    }

    //launch campaign------------------------------------------------------------------------------------------------------------------
    async launchCampaign(campaignId: mongoose.Schema.Types.ObjectId) {
        const campaign = await this.campaignModel.findById(campaignId);
        if (!campaign) throw new NotFoundException('Campaign Not Found');

        if (campaign.status !== 'draft') {
            throw new BadRequestException('Only draft campaigns can be launched');
        }

        const contacts = await this.contactsModel.find({
            tags: { $in: campaign.targetTags },
            workspaceId: campaign.workspaceId,
        }).lean();

        // ✅ snapshot message
        campaign.launchedMessage = {
            content: campaign.content,
            type: campaign.messageType,
            imagePath: campaign.messageType === 'Text and Image' ? campaign.imagePath : undefined, // 👈 only if needed
        };

        // ✅ snapshot contacts
        campaign.launchedContacts = contacts.map((c) => ({
            _id: c._id.toString(),
            name: c.name,
            phoneNumber: c.phoneNumber,
        }));

        campaign.launchedAt = new Date();
        campaign.status = 'success';

        return campaign.save();
    }

    //get campaigns per message type-----------------------------------------------------------------------
    async getCampaignStats(start: string, end: string, workspaceId: string) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);

        // aggregate campaigns
        const stats = await this.campaignModel.aggregate([
            {
                $match: {
                    status: 'success',
                    workspaceId: new mongoose.Types.ObjectId(workspaceId),
                    launchedAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$launchedAt" } },
                        messageType: "$messageType"
                    },
                    count: { $sum: { $size: { $ifNull: ["$launchedContacts", []] } } } // count messages = launchedContacts length
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    counts: {
                        $push: {
                            messageType: "$_id.messageType",
                            count: "$count"
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // ✅ Format result for Chart.js
        const labels: string[] = stats.map(s => s._id);

        const messageTypes = ["Text", "Text and Image"]; // known types
        const datasets = messageTypes.map(type => ({
            label: type,
            data: stats.map(s => {
                const found = s.counts.find((c: any) => c.messageType === type);
                return found ? found.count : 0;
            })
        }));

        return { labels, datasets };
    }

    //get number of contacs reached------------------------------------------------------------------------------------------------------------
    async getContactsReachedPerDay(start: string, end: string, workspaceId: string) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);

        const stats = await this.campaignModel.aggregate([
            {
                $match: {
                    status: 'success',
                    workspaceId: new mongoose.Types.ObjectId(workspaceId),
                    launchedAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$launchedAt" } },
                    totalContacts: { $sum: { $size: { $ifNull: ["$launchedContacts", []] } } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return {
            labels: stats.map(s => s._id),
            datasets: [
                {
                    label: "Contacts Reached",
                    data: stats.map(s => s.totalContacts)
                }
            ]
        };
    }

    //get recent 5 campaigns--------------------------------------------------------------------------------------------------------------------
    async getRecentCampaigns(workspaceId: string) {
        const campaigns = await this.campaignModel.find({ workspaceId })
            .sort({ createdAt: -1 }) // 👈 newest first
            .limit(5)                // 👈 only top 5
            .select("name targetTags createdAt status") // 👈 return only useful fields
            .exec();

        return campaigns;
    }

}