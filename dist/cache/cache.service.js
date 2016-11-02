"use strict";
var core_1 = require('@angular/core');
var cache_value_model_1 = require('./cache-value.model');
var CacheService = (function () {
    function CacheService() {
        console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', 'CacheService constructor');
        this._cache = new Map();
    }
    CacheService.prototype.get = function (key) {
        console.debug('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', 'CacheService get', key);
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
        console.debug('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', 'CacheService store', key, value, ttl);
        var cacheValue = new cache_value_model_1.CacheValue();
        cacheValue.value = value;
        if (ttl) {
            cacheValue.endValidityTime = Date.now() + ttl;
        }
        this._cache.set(key, cacheValue);
    };
    CacheService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], CacheService);
    return CacheService;
}());
exports.CacheService = CacheService;
//# sourceMappingURL=cache.service.js.map