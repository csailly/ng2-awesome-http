"use strict";
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Rx_1 = require('rxjs/Rx');
var cache_service_1 = require('./cache/cache.service');
var logger_1 = require('./logger');
var AwesomeHttpService = (function () {
    function AwesomeHttpService(_cacheService, _http) {
        this._cacheService = _cacheService;
        this._http = _http;
        this._logger = new logger_1.Logger();
        this._responseErrorInterceptors = [];
        this._responseSuccessInterceptors = [];
        this._requestInterceptors = [];
        this._globalHeaders = new http_1.Headers();
        this._config = { useCache: false, baseUrl: '', forceUpdate: false };
        this._cacheService.setLogger(this._logger);
    }
    AwesomeHttpService.prototype.setConfig = function (config) {
        // forceUpdate can only be set on request config
        this._config.baseUrl = config.baseUrl || this._config.baseUrl;
        this._config.useCache = config.useCache || this._config.useCache;
        this._config.ttl = config.ttl || this._config.ttl;
    };
    AwesomeHttpService.prototype.setLoggerConfig = function (loggerConfig) {
        this._logger.setConfig(loggerConfig);
    };
    /**
     * Performs a request with `get` http method.
     */
    AwesomeHttpService.prototype.get = function (url, options, httpConfig) {
        var _this = this;
        var fullUrl = this.getBaseUrl(httpConfig) + url;
        this.logFullUrl('GET', fullUrl);
        if (this.isUseCache(httpConfig) && !this.isForceUpdate(httpConfig)) {
            var fromCache = this._cacheService.get(fullUrl);
            if (fromCache) {
                this._logger.log('CACHE', fromCache);
                return Rx_1.Observable.of(fromCache);
            }
        }
        this.applyRequestInterceptors();
        var myoptions = this.applyGlobalHeaders(options);
        return this._http.get(fullUrl, myoptions)
            .map(function (res) { return _this.applyResponseSuccessInterceptors('GET', res); })
            .map(function (res) {
            if (_this.isUseCache(httpConfig)) {
                _this._cacheService.store(fullUrl, res, _this.getCacheTTL(httpConfig));
            }
            return res;
        })
            .catch(function (error) { return _this.applyResponseErrorInterceptors('GET', error); });
    };
    /**
     * Performs a request with `post` http method.
     */
    AwesomeHttpService.prototype.post = function (url, body, options, httpConfig) {
        var _this = this;
        var fullUrl = this.getBaseUrl(httpConfig) + url;
        this.logFullUrl('POST', fullUrl);
        this.applyRequestInterceptors();
        var myoptions = this.applyGlobalHeaders(options);
        return this._http.post(fullUrl, body, myoptions)
            .map(function (res) { return _this.applyResponseSuccessInterceptors('POST', res); })
            .catch(function (error) { return _this.applyResponseErrorInterceptors('POST', error); });
    };
    /**
     * Performs a request with `post` http method.
     */
    AwesomeHttpService.prototype.put = function (url, body, options, httpConfig) {
        var _this = this;
        var fullUrl = this.getBaseUrl(httpConfig) + url;
        this.logFullUrl('PUT', fullUrl);
        this.applyRequestInterceptors();
        var myoptions = this.applyGlobalHeaders(options);
        return this._http.put(fullUrl, body, myoptions)
            .map(function (res) { return _this.applyResponseSuccessInterceptors('PUT', res); })
            .catch(function (error) { return _this.applyResponseErrorInterceptors('PUT', error); });
    };
    /**
     * Performs a request with `delete` http method.
     */
    AwesomeHttpService.prototype.delete = function (url, options, httpConfig) {
        var _this = this;
        var fullUrl = this.getBaseUrl(httpConfig) + url;
        this.logFullUrl('DELETE', fullUrl);
        this.applyRequestInterceptors();
        var myoptions = this.applyGlobalHeaders(options);
        return this._http.delete(fullUrl, myoptions)
            .map(function (res) { return _this.applyResponseSuccessInterceptors('DELETE', res); })
            .catch(function (error) { return _this.applyResponseErrorInterceptors('DELETE', error); });
    };
    /**
     * Add a new Response interceptor
     * @param interceptor: the interceptor to add.
     */
    AwesomeHttpService.prototype.addResponseErrorInterceptor = function (interceptor) {
        this._logger.log('add Response Error Interceptor ');
        this._responseErrorInterceptors.push(interceptor);
    };
    /**
     * Add a new Response interceptor
     * @param interceptor: the interceptor to add.
     */
    AwesomeHttpService.prototype.addResponseSuccessInterceptor = function (interceptor) {
        this._logger.log('add Response Success Interceptor ');
        this._responseSuccessInterceptors.push(interceptor);
    };
    /**
     * Add a new Request interceptor
     * @param interceptor: the interceptor to add.
     */
    AwesomeHttpService.prototype.addRequestInterceptor = function (interceptor) {
        this._logger.log(' add Request Interceptor ');
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
    AwesomeHttpService.prototype.logFullUrl = function (httpMethod, fullUrl) {
        this._logger.log(httpMethod, fullUrl);
    };
    AwesomeHttpService.prototype.applyGlobalHeaders = function (options) {
        var myoptions = options || new http_1.RequestOptions({ headers: new http_1.Headers() });
        for (var _i = 0, _a = this._globalHeaders.keys(); _i < _a.length; _i++) {
            var key = _a[_i];
            myoptions.headers.append(key, this._globalHeaders.get(key));
        }
        return myoptions;
    };
    AwesomeHttpService.prototype.applyResponseErrorInterceptors = function (httpMethod, response) {
        this._logger.log(httpMethod, 'failed', response);
        for (var _i = 0, _a = this._responseErrorInterceptors; _i < _a.length; _i++) {
            var interceptor = _a[_i];
            interceptor.afterResponse(response);
        }
        return Rx_1.Observable.throw(response);
    };
    AwesomeHttpService.prototype.applyResponseSuccessInterceptors = function (httpMethod, response) {
        this._logger.log(httpMethod, 'successful', response);
        for (var _i = 0, _a = this._responseSuccessInterceptors; _i < _a.length; _i++) {
            var interceptor = _a[_i];
            interceptor.afterResponse(response);
        }
        return response;
    };
    AwesomeHttpService.prototype.applyRequestInterceptors = function () {
        for (var _i = 0, _a = this._requestInterceptors; _i < _a.length; _i++) {
            var interceptor = _a[_i];
            interceptor.beforeRequest();
        }
    };
    AwesomeHttpService.prototype.getBaseUrl = function (httpConfig) {
        if (httpConfig && httpConfig.baseUrl) {
            return this.normalizeUrl(httpConfig.baseUrl);
        }
        return this.normalizeUrl(this._config.baseUrl);
    };
    AwesomeHttpService.prototype.getCacheTTL = function (httpConfig) {
        if (httpConfig && httpConfig.ttl) {
            return httpConfig.ttl;
        }
        return this._config.ttl;
    };
    AwesomeHttpService.prototype.isForceUpdate = function (httpConfig) {
        if (httpConfig && httpConfig.forceUpdate !== undefined) {
            return httpConfig.forceUpdate;
        }
        return this._config.forceUpdate;
    };
    AwesomeHttpService.prototype.isUseCache = function (httpConfig) {
        if (httpConfig && httpConfig.useCache !== undefined) {
            return httpConfig.useCache;
        }
        return this._config.useCache;
    };
    /**
     * Ensure url end with '/' character.
     * @param url
     * @returns {string}
     */
    AwesomeHttpService.prototype.normalizeUrl = function (url) {
        if (url.length > 0 && url[url.length - 1] !== '/') {
            return url + '/';
        }
        return url;
    };
    AwesomeHttpService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [cache_service_1.CacheService, http_1.Http])
    ], AwesomeHttpService);
    return AwesomeHttpService;
}());
exports.AwesomeHttpService = AwesomeHttpService;
//# sourceMappingURL=awesome-http.service.js.map