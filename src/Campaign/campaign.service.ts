import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CampaignSchema } from "./campaign.schema";
import { Model } from "mongoose";
import { UsersSchema } from "src/Users/users.schema";
import { WorkspaceSchema } from "src/Workspace/workspace.schema";
import mongoose from 'mongoose';
import { CampaignDto, UpdateCampaignDto } from "./campaign.dto";
import { ContactsSchema } from "src/Contacts/contacts.schema";
import { MessageSchema } from "src/Message/message.schema";

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
        @InjectModel(ContactsSchema.name) private contactsModel: Model<ContactsSchema>,
        @InjectModel(MessageSchema.name) private messageModel: Model<MessageSchema>) { }

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

            const targetTags = campaignDto.targetTags;
            const contacts = await this.contactsModel.find({ workspaceId: campaignDto.workspaceId, tags: { $in: targetTags } }).exec();
            if (!contacts || contacts.length === 0) throw new BadRequestException('No contacts with specified tags');

            const newCampaign = new this.campaignModel({ createdBy: req.users._id, ...campaignDto });
            const savedCampaign = await newCampaign.save();
            return savedCampaign;
        }
        catch (err) {
            throw err;
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
    async editCampaign(campaignId: mongoose.Schema.Types.ObjectId, { ...updateCampaign }: UpdateCampaignDto) {
        try {
            const findCampaign = await this.campaignModel.findById(campaignId);
            if (!findCampaign) throw new NotFoundException('campaign not found');
            if (findCampaign.status === 'success') throw new BadRequestException('Launched Campaign Cannot be edited');

            const targetTags = updateCampaign.targetTags;
            const contacts = await this.contactsModel.find({ workspaceId: updateCampaign.workspaceId, tags: { $in: targetTags } }).exec();
            if (!contacts || contacts.length === 0) throw new BadRequestException('No contacts with specified tags');

            const editCampaign = await this.campaignModel.findOneAndUpdate(
                { _id: campaignId },
                { ...updateCampaign },
                { new: true }
            );
            if (!editCampaign) throw new NotFoundException('campaign not found');
            return editCampaign;
        } catch (err) {
            throw err;
        }
    }

    //get campaign by workspaceId--------------------------------------------------------------------------------------------------------
    async getCampaignByWorkspace(workspaceId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const campaigns = await this.campaignModel
            .find({ workspaceId: workspaceId })
            .skip(skip)
            .limit(limit)
            .exec();

        const total = await this.campaignModel.countDocuments({ workspaceId: workspaceId });

        return {
            data: campaigns,
            totalPages: Math.ceil(total / limit),
            total,
            page
        }
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

    // launch campaign------------------------------------------------------------------------------------------------------------------
    async launchCampaign(campaignId: mongoose.Schema.Types.ObjectId) {
        // 1. Find campaign
        const campaign = await this.campaignModel.findById(campaignId);
        if (!campaign) throw new NotFoundException('Campaign Not Found');

        if (campaign.status !== 'draft') {
            throw new BadRequestException('Only draft campaigns can be launched');
        }

        // 2. Find message template
        const message = await this.messageModel.findById(campaign.messageId).lean();
        if (!message) {
            throw new NotFoundException('Message template not found for this campaign');
        }

        // 3. Fetch contacts matching campaign target tags
        const contacts = await this.contactsModel.find({
            tags: { $in: campaign.targetTags },
            workspaceId: campaign.workspaceId,
        }).lean();

        // 4. Snapshot message into campaign
        campaign.launchedMessage = {
            content: message.content,
            type: message.messageType,
            imagePath: message.messageType === 'Text and Image' ? message.imagePath : undefined,
        };

        // 5. Snapshot contacts
        campaign.launchedContacts = contacts.map((c) => ({
            _id: c._id.toString(),
            name: c.name,
            phoneNumber: c.phoneNumber,
        }));

        // 6. Update status & timestamp
        campaign.launchedAt = new Date();
        campaign.status = 'success';

        // 7. Save and return
        return campaign.save();
    }


    //get campaigns per message type-----------------------------------------------------------------------
    async getCampaignStats(start: string, end: string, workspaceId: string) {
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
            // 🔍 join with Message collection to get messageType
            {
                $lookup: {
                    from: "messageschemas", // collection name for MessageSchema
                    localField: "messageId",
                    foreignField: "_id",
                    as: "message"
                }
            },
            { $unwind: "$message" }, // flatten message array
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$launchedAt" } },
                        messageType: "$message.messageType"
                    },
                    count: { $sum: { $size: { $ifNull: ["$launchedContacts", []] } } }
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

    //copy a campaign------------------------------------------------------------------------
    async copyCampaign(campaignId: string, req: any) {
        const campaign = await this.campaignModel.findById(campaignId).exec();
        if (!campaign) throw new NotFoundException("Campaign not found");

        if (campaign.status === "success") throw new BadRequestException("Launched campaign cannot be copied");

        const newCampaign = new this.campaignModel({
            createdBy: req.users._id,
            name: campaign.name,
            description: campaign.description,
            messageId: campaign.messageId,
            targetTags: campaign.targetTags,
            workspaceId: campaign.workspaceId,
            status: campaign.status
        })

        return newCampaign.save();
    }
}