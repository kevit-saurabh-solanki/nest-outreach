import { Controller, UseGuards, Param, Get, Post, Req, Body, Delete, Put } from "@nestjs/common";
import { CampaignService } from "./campaign.service";
import { AuthGuard } from "src/Auth/auth.guard";
import mongoose from "mongoose";
import { CampaignDto, UpdateCampaignDto } from "./campaign.dto";

@Controller('campaigns')
export class CampaignController {
    constructor(private campaignService: CampaignService) { }

    @Get()
    @UseGuards(AuthGuard)
    getAllCampaign() {
        return this.campaignService.getAllCampaign();
    }

    @Get(':campaignId')
    @UseGuards(AuthGuard)
    getCampaignById(@Param('campaignId') campaignId: mongoose.Schema.Types.ObjectId) {
        return this.campaignService.getCampaignById(campaignId);
    }

    @Post()
    @UseGuards(AuthGuard)
    addCampaign(@Body() campaignDto: CampaignDto, @Req() req: any) {
        return this.campaignService.addCampaign(campaignDto, req);
    }

    @Delete(':campaignId')
    @UseGuards(AuthGuard)
    deleteCampaign(@Param('campaignId') campaignId: mongoose.Schema.Types.ObjectId, @Req() req: any) {
        return this.campaignService.deleteCampaign(campaignId, req);
    }

    @Put(':campaignId')
    @UseGuards(AuthGuard)
    editCampaign(@Param('campaignId') campaignId: mongoose.Schema.Types.ObjectId, @Body() updateCampaignDto: UpdateCampaignDto, @Req() req: any) {
        return this.campaignService.editCampaign(campaignId, updateCampaignDto, req);
    }
}