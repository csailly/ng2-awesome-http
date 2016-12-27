import { Injectable } from '@angular/core';
import { CacheValue } from './cache-value.model';

import { Logger } from '../logger';

@Injectable()
export class CacheService {
  private _cache: Map<string, CacheValue>;

  private _logger: Logger;

  constructor() {
    this._cache = new Map<string, CacheValue>();
  }

  get(key: string): any {
    this._logger.debug('CacheService get', key);

    let cacheValue = this._cache.get(key);

    if (cacheValue && cacheValue.endValidityTime && Date.now() > cacheValue.endValidityTime) {
      this._cache.delete(key);
      return undefined;
    }

    if (cacheValue) {
      return cacheValue.value;
    }

    return undefined;
  }

  store(key: string, value: any, ttl?: number) {
    this._logger.debug('CacheService store', key, value, ttl);

    let cacheValue = new CacheValue();
    cacheValue.value = value;
    if (ttl) {
      cacheValue.endValidityTime = Date.now() + ttl;
    }
    this._cache.set(key, cacheValue);
  }

  setLogger(logger: Logger) {
    this._logger = logger;
  }


}
