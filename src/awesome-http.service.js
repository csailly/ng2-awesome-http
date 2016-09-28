"use strict";
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
var cache_service_1 = require("./cache/cache.service");
var AwesomeHttpService = (function () {
    function AwesomeHttpService(_cacheService, _http) {
        this._cacheService = _cacheService;
        this._http = _http;
        console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", "Module constructor");
        this._responseErrorInterceptors = [];
        this._responseSuccessInterceptors = [];
        this._requestInterceptors = [];
        this._globalHeaders = new http_1.Headers();
    }
    /**
     * Performs a request with `get` http method.
     */
    AwesomeHttpService.prototype.get = function (url, options, cacheConfig) {
        var _this = this;
        console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " GET ", url);
        if (cacheConfig && cacheConfig.useCache && !cacheConfig.forceUpdate) {
            var fromCache = this._cacheService.get(url);
            if (fromCache) {
                console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " CACHE", fromCache);
                return Rx_1.Observable.of(fromCache);
            }
        }
        this.applyRequestInterceptors();
        var myoptions = this.applyGlobalHeaders(options);
        return this._http.get(url, myoptions)
            .flatMap(function (res) {
            console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " GET successful", res);
            _this.applyResponseSuccessInterceptors(res);
            if (cacheConfig && cacheConfig.useCache) {
                _this._cacheService.store(url, res, cacheConfig.ttl);
            }
            return Rx_1.Observable.of(res);
        })
            .catch(function (error) {
            console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " GET failed", error);
            _this.applyResponseErrorInterceptors(error);
            return Rx_1.Observable.throw(error);
        });
    };
    /**
     * Performs a request with `post` http method.
     */
    AwesomeHttpService.prototype.post = function (url, body, options) {
        var _this = this;
        console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " POST ", url);
        this.applyRequestInterceptors();
        var myoptions = this.applyGlobalHeaders(options);
        return this._http.post(url, body, myoptions)
            .flatMap(function (res) {
            console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " POST successful", res);
            _this.applyResponseSuccessInterceptors(res);
            return Rx_1.Observable.of(res);
        })
            .catch(function (error) {
            console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " POST failed", error);
            _this.applyResponseErrorInterceptors(error);
            return Rx_1.Observable.throw(error);
        });
    };
    /**
     * Performs a request with `delete` http method.
     */
    AwesomeHttpService.prototype.delete = function (url, options) {
        var _this = this;
        console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " DELETE ", url);
        this.applyRequestInterceptors();
        var myoptions = this.applyGlobalHeaders(options);
        return this._http.delete(url, myoptions)
            .flatMap(function (res) {
            console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", "successful", res);
            _this.applyResponseSuccessInterceptors(res);
            return Rx_1.Observable.of(res);
        })
            .catch(function (error) {
            console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " DELETE failed", error);
            _this.applyResponseErrorInterceptors(error);
            return Rx_1.Observable.throw(error);
        });
    };
    /**
     * Add a new Response interceptor
     * @param interceptor: the interceptor to add.
     */
    AwesomeHttpService.prototype.addResponseErrorInterceptor = function (interceptor) {
        console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " add Response Error Interceptor ");
        this._responseErrorInterceptors.push(interceptor);
    };
    /**
     * Add a new Response interceptor
     * @param interceptor: the interceptor to add.
     */
    AwesomeHttpService.prototype.addResponseSuccessInterceptor = function (interceptor) {
        console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " add Response Success Interceptor ");
        this._responseSuccessInterceptors.push(interceptor);
    };
    /**
     * Add a new Request interceptor
     * @param interceptor: the interceptor to add.
     */
    AwesomeHttpService.prototype.addRequestInterceptor = function (interceptor) {
        console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " add Request Interceptor ");
        this._requestInterceptors.push(interceptor);
    };
    /**
     * Add a new header on each request.
     * @param name: the header name
     * @param value: the header value
     */
    AwesomeHttpService.prototype.addGlobalHeader = function (name, value) {
        this._globalHeaders.append(name, value);
    };
    AwesomeHttpService.prototype.applyGlobalHeaders = function (options) {
        var myoptions = options || new http_1.RequestOptions({ headers: new http_1.Headers() });
        for (var _i = 0, _a = this._globalHeaders.keys(); _i < _a.length; _i++) {
            var key = _a[_i];
            myoptions.headers.append(key, this._globalHeaders.get(key));
        }
        return myoptions;
    };
    AwesomeHttpService.prototype.applyResponseErrorInterceptors = function (response) {
        for (var _i = 0, _a = this._responseErrorInterceptors; _i < _a.length; _i++) {
            var interceptor = _a[_i];
            interceptor.afterResponse(response);
        }
    };
    AwesomeHttpService.prototype.applyResponseSuccessInterceptors = function (response) {
        for (var _i = 0, _a = this._responseSuccessInterceptors; _i < _a.length; _i++) {
            var interceptor = _a[_i];
            interceptor.afterResponse(response);
        }
    };
    AwesomeHttpService.prototype.applyRequestInterceptors = function () {
        for (var _i = 0, _a = this._requestInterceptors; _i < _a.length; _i++) {
            var interceptor = _a[_i];
            interceptor.beforeRequest();
        }
    };
    AwesomeHttpService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [cache_service_1.CacheService, http_1.Http])
    ], AwesomeHttpService);
    return AwesomeHttpService;
}());
exports.AwesomeHttpService = AwesomeHttpService;
//# sourceMappingURL=awesome-http.service.js.map