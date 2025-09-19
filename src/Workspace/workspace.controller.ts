import { Body, Controller, Post, Get, Param, Delete, Put, UseGuards, Req, ParseIntPipe, Query } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { UpdateWorkspaceDto, WorkspaceDto } from "./workspace.dto";
import { AuthGuard } from "src/Auth/auth.guard";
import { AdminGuard } from "src/Auth/admin.guard";

@Controller('workspaces')
export class WorkspaceControl {
    constructor(private workspaceService: WorkspaceService) { }

    @Post()
    @UseGuards(AuthGuard, AdminGuard)
    createWorkspace(@Body() workspaceDto: WorkspaceDto) {
        return this.workspaceService.createWorkspace(workspaceDto);
    }

    @Get()
    @UseGuards(AuthGuard)
    getAllWorkspace(@Query('page') page: number, @Query('limit') limit: number) {
        return this.workspaceService.getAllWorkspace(page, limit);
    }

    @Get(':workspaceId')
    @UseGuards(AuthGuard)
    getWorkspaceById(@Param('workspaceId') workspaceId: string) {
        return this.workspaceService.getWorkspaceById(workspaceId);
    }

    @Delete(':workspaceId')
    @UseGuards(AuthGuard, AdminGuard)
    deleteWorkspaceById(@Param('workspaceId') workspaceId: string) {
        return this.workspaceService.deleteWorkspaceById(workspaceId);
    }

    @Put(':workspaceId')
    @UseGuards(AuthGuard, AdminGuard)
    editWorkspaceById(@Param('workspaceId') workspaceId: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
        return this.workspaceService.editWorkspaceById(workspaceId, updateWorkspaceDto);
    }
}