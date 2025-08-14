import { Body, Controller, Post, Get, Param, Delete, Put, UseGuards, Req } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { UpdateWorkspaceDto, WorkspaceDto } from "./workspace.dto";
import { AuthGuard } from "src/Auth/auth.guard";

@Controller('workspaces')
export class WorkspaceControl {
    constructor(private workspaceService: WorkspaceService) { }

    @Post()
    @UseGuards(AuthGuard)
    createWorkspace(@Body() workspaceDto: WorkspaceDto, @Req() req: any) {
        return this.workspaceService.createWorkspace(workspaceDto, req);
    }

    @Get()
    @UseGuards(AuthGuard)
    getAllWorkspace(@Req() req: any) {
        return this.workspaceService.getAllWorkspace(req);
    }

    @Get(':workspceId')
    @UseGuards(AuthGuard)
    getWorkspaceById(@Param('workspaceId') workspaceId: number, @Req() req: any) {
        return this.workspaceService.getWorkspaceById(workspaceId, req);
    }

    @Delete(':workspceId')
    @UseGuards(AuthGuard)
    deleteWorkspaceById(@Param('workspaceId') workspaceId: number, @Req() req: any) {
        return this.workspaceService.deleteWorkspaceById(workspaceId, req);
    }

    @Put(':workspceId')
    @UseGuards(AuthGuard)
    editWorkspaceById(@Param('workspaceId') workspaceId: number, updateWorkspaceDto: UpdateWorkspaceDto, @Req() req: any) {
        return this.workspaceService.editWorkspaceById(workspaceId, updateWorkspaceDto, req);
    }
}