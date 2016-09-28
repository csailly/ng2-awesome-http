"use strict";
var testing_1 = require('@angular/core/testing');
var cache_service_1 = require("./cache.service");
describe('-= Cache Service =-', function () {
  beforeEach(function () {
    testing_1.TestBed.configureTestingModule({
      providers: [
        cache_service_1.CacheService,
      ]
    });
  });
  it('Should retrieve undefined value', testing_1.async(testing_1.inject([cache_service_1.CacheService], function (cacheService) {
    var value = cacheService.get('foo');
    expect(value).toBeUndefined();
  })));
  it('Should store value', testing_1.async(testing_1.inject([cache_service_1.CacheService], function (cacheService) {
    var value = cacheService.get('foo');
    expect(value).toBeUndefined();
    cacheService.store('foo', 'bar');
    value = cacheService.get('foo');
    expect(value).toEqual('bar');
  })));
  it('Should store value with TTL and retrieve it before end of TTL', testing_1.async(testing_1.inject([cache_service_1.CacheService], function (cacheService) {
    var value = cacheService.get('foo');
    expect(value).toBeUndefined();
    cacheService.store('foo', 'bar', 60000);
    value = cacheService.get('foo');
    expect(value).toEqual('bar');
  })));
  it('Should store value with TTL and not retrieve it after end of TTL', testing_1.async(testing_1.inject([cache_service_1.CacheService], function (cacheService) {
    var value = cacheService.get('foo');
    expect(value).toBeUndefined();
    cacheService.store('foo', 'bar', 5);
    setTimeout(function () {
      value = cacheService.get('foo');
      expect(value).toBeUndefined();
    }, 10);
  })));
});
//# sourceMappingURL=cache.service.spec.js.map
