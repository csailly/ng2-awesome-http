import { Logger } from '../logger';
export declare class CacheService {
    private _cache;
    private _logger;
    constructor();
    get(key: string): any;
    store(key: string, value: any, ttl?: number): void;
    setLogger(logger: Logger): void;
}
