import { Body, Controller, Post, Get, Param, Delete, Put, UseGuards, Req, ParseIntPipe } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { UpdateWorkspaceDto, WorkspaceDto } from "./workspace.dto";
import { AuthGuard } from "src/Auth/auth.guard";
import { AdminGuard } from "src/Auth/admin.guard";

@Controller('workspaces')
export class WorkspaceControl {
    constructor(private workspaceService: WorkspaceService) { }

    @Post()
    @UseGuards(AuthGuard, AdminGuard)
    createWorkspace(@Body() workspaceDto: WorkspaceDto, @Req() req: any) {
        return this.workspaceService.createWorkspace(workspaceDto, req);
    }

    @Get()
    @UseGuards(AuthGuard, AdminGuard)
    getAllWorkspace(@Req() req: any) {
        return this.workspaceService.getAllWorkspace(req);
    }

    @Get(':workspaceId')
    @UseGuards(AuthGuard, AdminGuard)
    getWorkspaceById(@Param('workspaceId', ParseIntPipe) workspaceId: number, @Req() req: any) {
        return this.workspaceService.getWorkspaceById(workspaceId, req);
    }

    @Delete(':workspaceId')
    @UseGuards(AuthGuard, AdminGuard)
    deleteWorkspaceById(@Param('workspaceId', ParseIntPipe) workspaceId: number, @Req() req: any) {
        return this.workspaceService.deleteWorkspaceById(workspaceId, req);
    }

    @Put(':workspaceId')
    @UseGuards(AuthGuard, AdminGuard)
    editWorkspaceById(@Param('workspaceId') workspaceId: number,@Body() updateWorkspaceDto: UpdateWorkspaceDto, @Req() req: any) {
        return this.workspaceService.editWorkspaceById(workspaceId, updateWorkspaceDto, req);
    }
}