import { Body, Controller, Post, Get, Param, Delete, Put } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { UpdateWorkspaceDto, WorkspaceDto } from "./workspace.dto";

@Controller('workspaces')
export class WorkspaceControl {
    constructor(private workspaceService: WorkspaceService) {}

    @Post()
    createWorkspace(@Body() workspaceDto: WorkspaceDto) {
        return this.workspaceService.createWorkspace(workspaceDto);
    }

    @Get()
    getAllWorkspace() {
        return this.workspaceService.getAllWorkspace();
    }

    @Get(':workspceId')
    getWorkspaceById(@Param('workspaceId') workspaceId: number) {
        return this.workspaceService.getWorkspaceById(workspaceId);
    }

    @Delete(':workspceId')
    deleteWorkspaceById(@Param('workspaceId') workspaceId: number) {
        return this.workspaceService.deleteWorkspaceById(workspaceId);
    }

    @Put(':workspceId')
    editWorkspaceById(@Param('workspaceId') workspaceId: number, updateWorkspaceDto: UpdateWorkspaceDto) {
        return this.workspaceService.editWorkspaceById(workspaceId, updateWorkspaceDto);
    }
}