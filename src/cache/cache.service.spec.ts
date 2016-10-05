import { inject, async, TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';
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

  it('Should update value', async(
    inject([CacheService], (cacheService: CacheService) => {
      let value = cacheService.get('foo');
      expect(value).toBeUndefined();

      cacheService.store('foo', 'bar');
      cacheService.store('foo', 'gee');
      value = cacheService.get('foo');
      expect(value).toEqual('gee');

    })
    )
  );

  it('Should store value with TTL and retrieve it before end of TTL', async(
    inject([CacheService], (cacheService: CacheService) => {
      let value = cacheService.get('foo');
      expect(value).toBeUndefined();

      cacheService.store('foo', 'bar', 60000);

      value = cacheService.get('foo');
      expect(value).toEqual('bar');
    })
    )
  );

  it('Should store value with TTL and not retrieve it after end of TTL', async(
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
