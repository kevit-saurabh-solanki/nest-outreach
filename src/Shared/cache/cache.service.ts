import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async wrap<T>(
        key: string,
        fetchFunction: () => Promise<T>,
        ttlSec = 120
    ): Promise<T> {
        const cached = await this.cacheManager.get<T>(key);
        if (cached) {
            console.log(`[CACHE HIT] ${key}`);
            return cached;
        }

        console.log(`[CACHE MISS] ${key}`);
        const freshData = await fetchFunction();
        await this.cacheManager.set(key, freshData,  ttlSec * 1000);
        return freshData;
    }
}
