import { Controller, UseGuards, Param, Get, Post, Req, Body, Delete, Put, Query } from "@nestjs/common";
import { CampaignService } from "./campaign.service";
import { AuthGuard } from "src/Auth/auth.guard";
import mongoose from "mongoose";
import { CampaignDto, UpdateCampaignDto } from "./campaign.dto";
import { UserGuard } from "src/Auth/user.guard";

@Controller('campaigns')
export class CampaignController {
    constructor(private campaignService: CampaignService) { }

    @Get()
    @UseGuards(AuthGuard)
    getAllCampaign() {
        return this.campaignService.getAllCampaign();
    }

    @Get('campaign-per-day')
    @UseGuards(AuthGuard)
    getCampaignPerDay(@Query('start') start: string, @Query('end') end: string, @Query('workspaceId') workspaceId: string) {
        return this.campaignService.getLaunchedCampaignsPerDay(start, end, workspaceId);
    }

    @Get('campaign-per-message-type')
    @UseGuards(AuthGuard)
    getCampaignPerMessageType(@Query('start') start: string, @Query('end') end: string, @Query('workspaceId') workspaceId: string) {
        return this.campaignService.getCampaignStats(start, end, workspaceId);
    }

    @Get('contacts-reached-per-day')
    @UseGuards(AuthGuard)
    getContactsReached(@Query('start') start: string, @Query('end') end: string, @Query('workspaceId') workspaceId: string) {
        return this.campaignService.getContactsReachedPerDay(start, end, workspaceId);
    }

    @Get('recent-campaigns')
    @UseGuards(AuthGuard)
    getRecentCampaigns(@Query('workspaceId') workspaceId: string) {
        return this.campaignService.getRecentCampaigns(workspaceId)
    }

    @Get('workspace/:workspaceId')
    @UseGuards(AuthGuard)
    async getMessages(@Param('workspaceId') workspaceId: string, @Query('page') page: number, @Query('limit') limit: number) {
        return this.campaignService.getCampaignByWorkspace(workspaceId, page, limit);
    }

    @Post()
    @UseGuards(AuthGuard, UserGuard)
    addCampaign(@Body() campaignDto: CampaignDto, @Req() req: any) {
        return this.campaignService.addCampaign(campaignDto, req);
    }

    @Post('copy/:campaignId')
    @UseGuards(AuthGuard, UserGuard)
    copyCampaign(@Param('campaignId') campaignId: string, @Req() req: any) {
        return this.campaignService.copyCampaign(campaignId, req);
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

    @Post(':id/launch')
    @UseGuards(AuthGuard, UserGuard)
    async launchCampaign(@Param('id') campaignId: mongoose.Schema.Types.ObjectId) {
        return this.campaignService.launchCampaign(campaignId);
    }


    @Get(':campaignId')
    @UseGuards(AuthGuard)
    getCampaignById(@Param('campaignId') campaignId: mongoose.Schema.Types.ObjectId) {
        return this.campaignService.getCampaignById(campaignId);
    }
}