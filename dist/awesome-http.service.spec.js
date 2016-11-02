"use strict";
var testing_1 = require('@angular/core/testing');
var testing_2 = require('@angular/http/testing');
var http_1 = require('@angular/http');
var awesome_http_service_1 = require('./awesome-http.service');
var cache_service_1 = require('./cache/cache.service');
var mockHttpProvider = {
    provide: http_1.Http,
    deps: [testing_2.MockBackend, http_1.BaseRequestOptions],
    useFactory: function (backend, defaultOptions) {
        return new http_1.Http(backend, defaultOptions);
    }
};
describe('-= Awesome Http Service =-', function () {
    var cacheService;
    var httpService;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [
                testing_2.MockBackend,
                http_1.BaseRequestOptions,
                mockHttpProvider,
                cache_service_1.CacheService,
                awesome_http_service_1.AwesomeHttpService
            ]
        });
        cacheService = testing_1.TestBed.get(cache_service_1.CacheService);
        httpService = testing_1.TestBed.get(http_1.Http);
    });
    it('Should perform a GET request with default baseUrl config', testing_1.async(testing_1.inject([awesome_http_service_1.AwesomeHttpService, testing_2.MockBackend], function (awesomeHttpService, backend) {
        var apiEndPoint = 'http://foo.bar.com';
        backend.connections.subscribe(function (connection) {
            expect(connection.request.method).toBe(http_1.RequestMethod.Get);
            expect(connection.request.url).toBe(apiEndPoint);
        });
        awesomeHttpService.get(apiEndPoint);
    })));
    it('Should perform a GET request with base url set in request config', testing_1.async(testing_1.inject([awesome_http_service_1.AwesomeHttpService, testing_2.MockBackend], function (awesomeHttpService, backend) {
        var baseUrl = 'http://foo.bar.com';
        var apiEndPoint = 'myEndpoint';
        backend.connections.subscribe(function (connection) {
            expect(connection.request.method).toBe(http_1.RequestMethod.Get);
            expect(connection.request.url).toBe(baseUrl + '/' + apiEndPoint);
        });
        awesomeHttpService.get(apiEndPoint, null, { baseUrl: baseUrl });
    })));
    it('Should perform a GET request with base url set in service config', testing_1.async(testing_1.inject([awesome_http_service_1.AwesomeHttpService, testing_2.MockBackend], function (awesomeHttpService, backend) {
        var baseUrl = 'http://foo.bar.com';
        var apiEndPoint = 'myEndpoint';
        backend.connections.subscribe(function (connection) {
            expect(connection.request.method).toBe(http_1.RequestMethod.Get);
            expect(connection.request.url).toBe(baseUrl + '/' + apiEndPoint);
        });
        awesomeHttpService.setConfig({ baseUrl: baseUrl });
        awesomeHttpService.get(apiEndPoint);
    })));
    it('Should perform 2 GET requests with default config, without retrieve from cache', testing_1.async(testing_1.inject([awesome_http_service_1.AwesomeHttpService, testing_2.MockBackend], function (awesomeHttpService, backend) {
        var apiEndPoint = 'http://foo.bar.com';
        var cacheGetSpy = spyOn(cacheService, 'get').and.callThrough();
        var cacheStoreSpy = spyOn(cacheService, 'store').and.callThrough();
        var httpGetSpy = spyOn(httpService, 'get').and.callThrough();
        backend.connections.subscribe(function (connection) {
            var mockResponseBody = {
                title: 'Me',
                content: 'Testing is a good thing'
            };
            var response = new http_1.ResponseOptions({ body: JSON.stringify(mockResponseBody) });
            connection.mockRespond(new http_1.Response(response));
        });
        // 1st call
        var firstCall = awesomeHttpService.get(apiEndPoint);
        firstCall.subscribe(function () {
            // 2nd call
            awesomeHttpService.get(apiEndPoint).subscribe();
        });
        // Expect 0 cache get
        expect(cacheGetSpy.calls.count()).toEqual(0);
        // Expect 0 cache store
        expect(cacheStoreSpy.calls.count()).toEqual(0);
        // Expect 2 GET requests
        expect(httpGetSpy.calls.count()).toEqual(2);
    })));
    it('Should perform 2 GET requests with cache set in request config', testing_1.async(testing_1.inject([awesome_http_service_1.AwesomeHttpService, testing_2.MockBackend], function (awesomeHttpService, backend) {
        var apiEndPoint = 'http://foo.bar.com';
        var cacheGetSpy = spyOn(cacheService, 'get').and.callThrough();
        var cacheStoreSpy = spyOn(cacheService, 'store').and.callThrough();
        var httpGetSpy = spyOn(httpService, 'get').and.callThrough();
        backend.connections.subscribe(function (connection) {
            var mockResponseBody = {
                title: 'Me',
                content: 'Testing is a good thing'
            };
            var response = new http_1.ResponseOptions({ body: JSON.stringify(mockResponseBody) });
            connection.mockRespond(new http_1.Response(response));
        });
        // 1st call that should store into cache
        var firstCall = awesomeHttpService.get(apiEndPoint, null, { useCache: true });
        firstCall.subscribe(function () {
            // 2nd call that should retrieve from cache
            awesomeHttpService.get(apiEndPoint, null, { useCache: true }).subscribe();
        });
        // Expect 2 cache get
        expect(cacheGetSpy.calls.count()).toEqual(2);
        // Expect 1 cache store
        expect(cacheStoreSpy.calls.count()).toEqual(1);
        // Expect 1 GET request
        expect(httpGetSpy.calls.count()).toEqual(1);
    })));
    it('Should perform 2 GET requests with cache set in service config', testing_1.async(testing_1.inject([awesome_http_service_1.AwesomeHttpService, testing_2.MockBackend], function (awesomeHttpService, backend) {
        var apiEndPoint = 'http://foo.bar.com';
        var cacheGetSpy = spyOn(cacheService, 'get').and.callThrough();
        var cacheStoreSpy = spyOn(cacheService, 'store').and.callThrough();
        var httpGetSpy = spyOn(httpService, 'get').and.callThrough();
        backend.connections.subscribe(function (connection) {
            var mockResponseBody = {
                title: 'Me',
                content: 'Testing is a good thing'
            };
            var response = new http_1.ResponseOptions({ body: JSON.stringify(mockResponseBody) });
            connection.mockRespond(new http_1.Response(response));
        });
        awesomeHttpService.setConfig({ useCache: true });
        // 1st call that should store into cache
        var firstCall = awesomeHttpService.get(apiEndPoint);
        firstCall.subscribe(function () {
            // 2nd call that should retrieve from cache
            awesomeHttpService.get(apiEndPoint).subscribe();
        });
        // Expect 2 cache get
        expect(cacheGetSpy.calls.count()).toEqual(2);
        // Expect 1 cache store
        expect(cacheStoreSpy.calls.count()).toEqual(1);
        // Expect 1 GET request
        expect(httpGetSpy.calls.count()).toEqual(1);
    })));
    it('Should perform 2 GET requests with cache set in service config and forceUpdate set in request config', testing_1.async(testing_1.inject([awesome_http_service_1.AwesomeHttpService, testing_2.MockBackend], function (awesomeHttpService, backend) {
        var apiEndPoint = 'http://foo.bar.com';
        var cacheGetSpy = spyOn(cacheService, 'get').and.callThrough();
        var cacheStoreSpy = spyOn(cacheService, 'store').and.callThrough();
        var httpGetSpy = spyOn(httpService, 'get').and.callThrough();
        backend.connections.subscribe(function (connection) {
            var mockResponseBody = {
                title: 'Me',
                content: 'Testing is a good thing'
            };
            var response = new http_1.ResponseOptions({ body: JSON.stringify(mockResponseBody) });
            connection.mockRespond(new http_1.Response(response));
        });
        awesomeHttpService.setConfig({ useCache: true });
        // 1st call that should store into cache
        var firstCall = awesomeHttpService.get(apiEndPoint);
        firstCall.subscribe(function () {
            // 2nd call that should retrieve from cache
            awesomeHttpService.get(apiEndPoint, null, { forceUpdate: true }).subscribe();
        });
        // Expect 1 cache get
        expect(cacheGetSpy.calls.count()).toEqual(1);
        // Expect 2 cache store
        expect(cacheStoreSpy.calls.count()).toEqual(2);
        // Expect 2 GET requests
        expect(httpGetSpy.calls.count()).toEqual(2);
    })));
    it('Should perform 2 GET requests with cache and forceUpdate set in service config. Should ignore forceUpdate', testing_1.async(testing_1.inject([awesome_http_service_1.AwesomeHttpService, testing_2.MockBackend], function (awesomeHttpService, backend) {
        var apiEndPoint = 'http://foo.bar.com';
        var cacheGetSpy = spyOn(cacheService, 'get').and.callThrough();
        var cacheStoreSpy = spyOn(cacheService, 'store').and.callThrough();
        var httpGetSpy = spyOn(httpService, 'get').and.callThrough();
        backend.connections.subscribe(function (connection) {
            var mockResponseBody = {
                title: 'Me',
                content: 'Testing is a good thing'
            };
            var response = new http_1.ResponseOptions({ body: JSON.stringify(mockResponseBody) });
            connection.mockRespond(new http_1.Response(response));
        });
        awesomeHttpService.setConfig({ useCache: true, forceUpdate: true });
        // 1st call that should store into cache
        var firstCall = awesomeHttpService.get(apiEndPoint);
        firstCall.subscribe(function () {
            // 2nd call that should retrieve from cache
            awesomeHttpService.get(apiEndPoint).subscribe();
        });
        // Expect 2 cache get
        expect(cacheGetSpy.calls.count()).toEqual(2);
        // Expect 1 cache store
        expect(cacheStoreSpy.calls.count()).toEqual(1);
        // Expect 1 GET request
        expect(httpGetSpy.calls.count()).toEqual(1);
    })));
});
//# sourceMappingURL=awesome-http.service.spec.js.map