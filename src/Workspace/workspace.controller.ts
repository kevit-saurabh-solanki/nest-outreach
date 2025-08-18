import { Body, Controller, Post, Get, Param, Delete, Put, UseGuards, Req, ParseIntPipe } from "@nestjs/common";
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

    @Get(':workspaceId')
    @UseGuards(AuthGuard)
    getWorkspaceById(@Param('workspaceId', ParseIntPipe) workspaceId: number, @Req() req: any) {
        return this.workspaceService.getWorkspaceById(workspaceId, req);
    }

    @Delete(':workspaceId')
    @UseGuards(AuthGuard)
    deleteWorkspaceById(@Param('workspaceId', ParseIntPipe) workspaceId: number, @Req() req: any) {
        return this.workspaceService.deleteWorkspaceById(workspaceId, req);
    }

    @Put(':workspaceId')
    @UseGuards(AuthGuard)
    editWorkspaceById(@Param('workspaceId') workspaceId: number,@Body() updateWorkspaceDto: UpdateWorkspaceDto, @Req() req: any) {
        return this.workspaceService.editWorkspaceById(workspaceId, updateWorkspaceDto, req);
    }
}