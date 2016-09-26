import {Injectable} from "@angular/core";
import {CacheValue} from "./cache-value";

@Injectable()
export class CacheService {
  private _cache: Map<string, CacheValue>;

  constructor() {
    this._cache = new Map<string, CacheValue>();
  }

  get(key: string): any {
    let cacheValue = this._cache.get(key);

    if (cacheValue && cacheValue.endValidityTime && Date.now() > cacheValue.endValidityTime) {
      this._cache.delete(key);
      return undefined;
    }

    if (cacheValue){
      return cacheValue.value;
    }

    return undefined;
  }

  store(key: string, value: any, ttl?: number) {
    let cacheValue = new CacheValue();
    cacheValue.value = value;
    if (ttl) {
      cacheValue.endValidityTime = Date.now() + ttl;
    }
    this._cache.set(key, cacheValue);
  }


}
