import { Module } from "@nestjs/common";
import { AuditLogController } from "./auditLog.controller";
import { AuditLogService } from "./auditLog.service";
import { LogConsumer } from "./logConsumer.controller";
import { RedisModule } from "../cache/redis.module";
import { MongooseModule } from "@nestjs/mongoose";
import { auditLogSchema, AuditLogSchema } from "./auditLog.schema";
import { CacheService } from "../cache/cache.service";

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: AuditLogSchema.name,
            schema: auditLogSchema
        }
    ]), RedisModule],
    controllers: [AuditLogController, LogConsumer],
    providers: [AuditLogService, CacheService]
})
export class AuditLogModule {}