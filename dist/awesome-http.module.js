"use strict";
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var awesome_http_service_1 = require('./awesome-http.service');
var cache_service_1 = require('./cache/cache.service');
var awesome_http_service_2 = require('./awesome-http.service');
exports.AwesomeHttpService = awesome_http_service_2.AwesomeHttpService;
var AwesomeHttpModule = (function () {
    function AwesomeHttpModule() {
    }
    AwesomeHttpModule = __decorate([
        core_1.NgModule({
            imports: [
                http_1.HttpModule
            ],
            providers: [awesome_http_service_1.AwesomeHttpService, cache_service_1.CacheService]
        }), 
        __metadata('design:paramtypes', [])
    ], AwesomeHttpModule);
    return AwesomeHttpModule;
}());
exports.AwesomeHttpModule = AwesomeHttpModule;
//# sourceMappingURL=awesome-http.module.js.map