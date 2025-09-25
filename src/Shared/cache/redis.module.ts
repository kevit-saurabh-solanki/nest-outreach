import { Module } from "@nestjs/common";
import { RedisProvider } from "./redis.provider";

@Module({
    exports: [RedisProvider],
    providers: [RedisProvider]
})
export class RedisModule {}