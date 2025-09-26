import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { AuditLogSchema } from "./auditLog.schema";
import { CacheService } from "../cache/cache.service";

@Injectable()
export class AuditLogService {

    constructor(@InjectModel(AuditLogSchema.name) private auditSchemaModel: Model<AuditLogSchema>,
        private cacheService: CacheService) { }

    async getAllLogsByWorkspaceId(workspaceId: mongoose.Schema.Types.ObjectId) {
        return this.cacheService.wrap(`logs:workspace:${workspaceId}`, async () => {
            const logs = await this.auditSchemaModel.find({ workspaceId: workspaceId })
            .populate([
                {
                    path: 'workspaceId',
                    select: 'name _id'
                },
                {
                    path: 'actionTakenBy',
                    select: 'email _id'
                },
                {
                    path: 'actionTakenOn',
                    select: '_id name title phoneNumber'
                }
            ]).exec();
            return logs;
        }, 3600);
    }
}