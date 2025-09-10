import { Controller, UseGuards, Param, Get, Post, Req, Body, Delete, Put } from "@nestjs/common";
import { CampaignService } from "./campaign.service";
import { AuthGuard } from "src/Auth/auth.guard";
import mongoose from "mongoose";
import { CampaignDto, UpdateCampaignDto } from "./campaign.dto";
import { UserGuard } from "src/Auth/user.guard";

@Controller('campaigns')
export class CampaignController {
    constructor(private campaignService: CampaignService) { }

    // @Get()
    // @UseGuards(AuthGuard)
    // getAllCampaign() {
    //     return this.campaignService.getAllCampaign();
    // }

    @Get()
    @UseGuards(AuthGuard)
    getContactByWorkspaceId(@Req() req: any) {
        return this.campaignService.getCampaignByWorkspaceId(req);
    }

    @Get(':campaignId')
    @UseGuards(AuthGuard)
    getCampaignById(@Param('campaignId') campaignId: mongoose.Schema.Types.ObjectId) {
        return this.campaignService.getCampaignById(campaignId);
    }

    @Post()
    @UseGuards(AuthGuard, UserGuard)
    addCampaign(@Body() campaignDto: CampaignDto, @Req() req: any) {
        return this.campaignService.addCampaign(campaignDto, req);
    }

    @Delete(':campaignId')
    @UseGuards(AuthGuard, UserGuard)
    deleteCampaign(@Param('campaignId') campaignId: mongoose.Schema.Types.ObjectId) {
        return this.campaignService.deleteCampaign(campaignId);
    }

    @Put(':campaignId')
    @UseGuards(AuthGuard, UserGuard)
    editCampaign(@Param('campaignId') campaignId: mongoose.Schema.Types.ObjectId, @Body() updateCampaignDto: UpdateCampaignDto) {
        return this.campaignService.editCampaign(campaignId, updateCampaignDto);
    }
}