"use strict";
var core_1 = require('@angular/core');
var cache_value_model_1 = require('./cache-value.model');
var CacheService = (function () {
    function CacheService() {
        this._cache = new Map();
    }
    CacheService.prototype.get = function (key) {
        this._logger.debug('CacheService get', key);
        var cacheValue = this._cache.get(key);
        if (cacheValue && cacheValue.endValidityTime && Date.now() > cacheValue.endValidityTime) {
            this._cache.delete(key);
            return undefined;
        }
        if (cacheValue) {
            return cacheValue.value;
        }
        return undefined;
    };
    CacheService.prototype.store = function (key, value, ttl) {
        this._logger.debug('CacheService store', key, value, ttl);
        var cacheValue = new cache_value_model_1.CacheValue();
        cacheValue.value = value;
        if (ttl) {
            cacheValue.endValidityTime = Date.now() + ttl;
        }
        this._cache.set(key, cacheValue);
    };
    CacheService.prototype.setLogger = function (logger) {
        this._logger = logger;
    };
    CacheService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], CacheService);
    return CacheService;
}());
exports.CacheService = CacheService;
//# sourceMappingURL=cache.service.js.map