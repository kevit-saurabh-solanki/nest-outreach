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

    async set<T>(key: string, value: T, ttlSec = 120): Promise<void> {
        await this.redisClient.set(key,  JSON.stringify(value), "EX", ttlSec);
    }

    async get<T>(key: string): Promise<T | null> {
        const cached = await this.redisClient.get(key);
        return cached ? JSON.parse(cached) : null;
    }

    async del<T>(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}
