import {Injectable} from "@angular/core";

@Injectable()
export class CacheService {
  private _cache: Map<string,any>;

  constructor() {
    this._cache = new Map<string, any>();
  }

  get(key: string): any {
    return this._cache.get(key);
  }

  store(key: string, value: any) {
    this._cache.set(key, value);
  }


}
