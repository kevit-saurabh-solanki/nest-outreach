import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {

    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) { }

    async wrap<T>(key: string, fetchFuction: () => Promise<T>, ttlSec = 120) {
        const cached = await this.redisClient.get(key);
        if (cached) {
            return JSON.parse(cached)
        }

        const freshData = await fetchFuction();
        await this.redisClient.set(key, JSON.stringify(freshData), "EX", ttlSec);
        return freshData;
    }

    async del<T>(key: string): Promise<void> {
        const keys = await this.redisClient.keys(`${key}`);

        if (keys.length > 0) {
            await this.redisClient.del(...keys);
        }
    }
}
