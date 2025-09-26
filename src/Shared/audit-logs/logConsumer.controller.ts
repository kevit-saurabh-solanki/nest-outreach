import { Controller } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AuditLogSchema } from "./auditLog.schema";
import { Model } from 'mongoose'
import { EventPattern, Payload } from "@nestjs/microservices";

@Controller()
export class LogConsumer {

    constructor(@InjectModel(AuditLogSchema.name) private auditSchemaModel: Model<AuditLogSchema>) { }

    @EventPattern('audit_log')
    async handleAuditLog(@Payload() log: any) {
        console.log(`[x] Audit log recieved: ${log.action}`);
        const newLog = new this.auditSchemaModel(log);
        return await newLog.save();
    }
}