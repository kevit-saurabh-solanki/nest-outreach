import { Controller, Param, Get } from "@nestjs/common";
import { AuditLogService } from "./auditLog.service";
import mongoose from "mongoose";

@Controller('audit_logs')
export class AuditLogController {

    constructor(private auditService: AuditLogService) {}

    @Get(':workspaceId')
    async getAllLogsByWorkspaceId(@Param('workspaceId') workspaceId: mongoose.Schema.Types.ObjectId) {
        return await this.auditService.getAllLogsByWorkspaceId(workspaceId);
    }
}