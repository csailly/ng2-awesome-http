import {CacheService} from "./cache.service";
import {inject, async, TestBed} from "@angular/core/testing";
describe('-= Cache Service =-', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CacheService,
      ]
    });
  });

  it('Should retrieve undefined value', async(
    inject([CacheService], (cacheService: CacheService) => {
      let value = cacheService.get('foo');
      expect(value).toBeUndefined();
    })
    )
  );

  it('Should store value', async(
    inject([CacheService], (cacheService: CacheService) => {
      let value = cacheService.get('foo');
      expect(value).toBeUndefined();

      cacheService.store('foo', 'bar');

      value = cacheService.get('foo');
      expect(value).toEqual('bar');
    })
    )
  );

  it('Should store value with TTL', async(
    inject([CacheService], (cacheService: CacheService) => {
      let value = cacheService.get('foo');
      expect(value).toBeUndefined();

      cacheService.store('foo', 'bar', 60000);

      value = cacheService.get('foo');
      expect(value).toEqual('bar');
    })
    )
  );

  it('Should store value with TTL', async(
    inject([CacheService], (cacheService: CacheService) => {
      let value = cacheService.get('foo');
      expect(value).toBeUndefined();

      cacheService.store('foo', 'bar', 5);

      setTimeout(() => {
        value = cacheService.get('foo');
        expect(value).toBeUndefined();
      }, 10);


    })
    )
  );


});
