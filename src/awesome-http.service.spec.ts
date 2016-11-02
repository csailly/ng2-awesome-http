import { TestBed, inject, async } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { AwesomeHttpService } from './awesome-http.service';
import { CacheService } from './cache/cache.service';
import { Observable } from 'rxjs';
import Spy = jasmine.Spy;


const mockHttpProvider = {
  provide: Http,
  deps: [MockBackend, BaseRequestOptions],
  useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
    return new Http(backend, defaultOptions);
  }
};

describe('-= Awesome Http Service =-', () => {

  let cacheService: CacheService;
  let httpService: Http;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        mockHttpProvider,
        CacheService,
        AwesomeHttpService
      ]
    });

    cacheService = TestBed.get(CacheService);

    httpService = TestBed.get(Http);

  });


  it('Should perform a GET request with default baseUrl config', async(
    inject([AwesomeHttpService, MockBackend], (awesomeHttpService: AwesomeHttpService, backend: MockBackend) => {

      let apiEndPoint: string = 'http://foo.bar.com';

      backend.connections.subscribe(
        (connection: MockConnection) => {
          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(connection.request.url).toBe(apiEndPoint);
        }
      );

      awesomeHttpService.get(apiEndPoint);
    })
    )
  );

  it('Should perform a GET request with base url set in request config', async(
    inject([AwesomeHttpService, MockBackend], (awesomeHttpService: AwesomeHttpService, backend: MockBackend) => {

      let baseUrl: string = 'http://foo.bar.com';
      let apiEndPoint: string = 'myEndpoint';

      backend.connections.subscribe(
        (connection: MockConnection) => {
          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(connection.request.url).toBe(baseUrl + '/' + apiEndPoint);
        }
      );

      awesomeHttpService.get(apiEndPoint, null, {baseUrl: baseUrl});

    })
    )
  );

  it('Should perform a GET request with base url set in service config', async(
    inject([AwesomeHttpService, MockBackend], (awesomeHttpService: AwesomeHttpService, backend: MockBackend) => {

      let baseUrl: string = 'http://foo.bar.com';
      let apiEndPoint: string = 'myEndpoint';

      backend.connections.subscribe(
        (connection: MockConnection) => {
          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(connection.request.url).toBe(baseUrl + '/' + apiEndPoint);
        }
      );

      awesomeHttpService.setConfig({baseUrl: baseUrl});

      awesomeHttpService.get(apiEndPoint);
    })
    )
  );

  it('Should perform 2 GET requests with default config, without retrieve from cache', async(
    inject([AwesomeHttpService, MockBackend], (awesomeHttpService: AwesomeHttpService, backend: MockBackend) => {

      let apiEndPoint: string = 'http://foo.bar.com';

      let cacheGetSpy: Spy = spyOn(cacheService, 'get').and.callThrough();
      let cacheStoreSpy: Spy = spyOn(cacheService, 'store').and.callThrough();
      let httpGetSpy: Spy = spyOn(httpService, 'get').and.callThrough();


      backend.connections.subscribe(
        (connection: MockConnection) => {
          let mockResponseBody: any = {
            title: 'Me',
            content: 'Testing is a good thing'
          };

          let response = new ResponseOptions({body: JSON.stringify(mockResponseBody)});
          connection.mockRespond(new Response(response));
        }
      );

      // 1st call
      let firstCall: Observable<Response> = awesomeHttpService.get(apiEndPoint);

      firstCall.subscribe(() => {
        // 2nd call
        awesomeHttpService.get(apiEndPoint).subscribe();
      });


      // Expect 0 cache get
      expect(cacheGetSpy.calls.count()).toEqual(0);

      // Expect 0 cache store
      expect(cacheStoreSpy.calls.count()).toEqual(0);

      // Expect 2 GET requests
      expect(httpGetSpy.calls.count()).toEqual(2);
    })
    )
  );

  it('Should perform 2 GET requests with cache set in request config', async(
    inject([AwesomeHttpService, MockBackend], (awesomeHttpService: AwesomeHttpService, backend: MockBackend) => {

      let apiEndPoint: string = 'http://foo.bar.com';

      let cacheGetSpy: Spy = spyOn(cacheService, 'get').and.callThrough();
      let cacheStoreSpy: Spy = spyOn(cacheService, 'store').and.callThrough();
      let httpGetSpy: Spy = spyOn(httpService, 'get').and.callThrough();

      backend.connections.subscribe(
        (connection: MockConnection) => {
          let mockResponseBody: any = {
            title: 'Me',
            content: 'Testing is a good thing'
          };

          let response = new ResponseOptions({body: JSON.stringify(mockResponseBody)});
          connection.mockRespond(new Response(response));
        }
      );

      // 1st call that should store into cache
      let firstCall: Observable<Response> = awesomeHttpService.get(apiEndPoint, null, {useCache: true});

      firstCall.subscribe(() => {
        // 2nd call that should retrieve from cache
        awesomeHttpService.get(apiEndPoint, null, {useCache: true}).subscribe();
      });


      // Expect 2 cache get
      expect(cacheGetSpy.calls.count()).toEqual(2);

      // Expect 1 cache store
      expect(cacheStoreSpy.calls.count()).toEqual(1);

      // Expect 1 GET request
      expect(httpGetSpy.calls.count()).toEqual(1);

    })
    )
  );

  it('Should perform 2 GET requests with cache set in service config', async(
    inject([AwesomeHttpService, MockBackend], (awesomeHttpService: AwesomeHttpService, backend: MockBackend) => {

      let apiEndPoint: string = 'http://foo.bar.com';

      let cacheGetSpy: Spy = spyOn(cacheService, 'get').and.callThrough();
      let cacheStoreSpy: Spy = spyOn(cacheService, 'store').and.callThrough();
      let httpGetSpy: Spy = spyOn(httpService, 'get').and.callThrough();

      backend.connections.subscribe(
        (connection: MockConnection) => {
          let mockResponseBody: any = {
            title: 'Me',
            content: 'Testing is a good thing'
          };

          let response = new ResponseOptions({body: JSON.stringify(mockResponseBody)});
          connection.mockRespond(new Response(response));
        }
      );

      awesomeHttpService.setConfig({useCache: true});

      // 1st call that should store into cache
      let firstCall: Observable<Response> = awesomeHttpService.get(apiEndPoint);

      firstCall.subscribe(() => {
        // 2nd call that should retrieve from cache
        awesomeHttpService.get(apiEndPoint).subscribe();
      });


      // Expect 2 cache get
      expect(cacheGetSpy.calls.count()).toEqual(2);

      // Expect 1 cache store
      expect(cacheStoreSpy.calls.count()).toEqual(1);

      // Expect 1 GET request
      expect(httpGetSpy.calls.count()).toEqual(1);

    })
    )
  );

  it('Should perform 2 GET requests with cache set in service config and forceUpdate set in request config', async(
    inject([AwesomeHttpService, MockBackend], (awesomeHttpService: AwesomeHttpService, backend: MockBackend) => {

      let apiEndPoint: string = 'http://foo.bar.com';

      let cacheGetSpy: Spy = spyOn(cacheService, 'get').and.callThrough();
      let cacheStoreSpy: Spy = spyOn(cacheService, 'store').and.callThrough();
      let httpGetSpy: Spy = spyOn(httpService, 'get').and.callThrough();

      backend.connections.subscribe(
        (connection: MockConnection) => {
          let mockResponseBody: any = {
            title: 'Me',
            content: 'Testing is a good thing'
          };

          let response = new ResponseOptions({body: JSON.stringify(mockResponseBody)});
          connection.mockRespond(new Response(response));
        }
      );

      awesomeHttpService.setConfig({useCache: true});

      // 1st call that should store into cache
      let firstCall: Observable<Response> = awesomeHttpService.get(apiEndPoint);

      firstCall.subscribe(() => {
        // 2nd call that should retrieve from cache
        awesomeHttpService.get(apiEndPoint,null, {forceUpdate: true}).subscribe();
      });


      // Expect 1 cache get
      expect(cacheGetSpy.calls.count()).toEqual(1);

      // Expect 2 cache store
      expect(cacheStoreSpy.calls.count()).toEqual(2);

      // Expect 2 GET requests
      expect(httpGetSpy.calls.count()).toEqual(2);

    })
    )
  );

  it('Should perform 2 GET requests with cache and forceUpdate set in service config. Should ignore forceUpdate', async(
    inject([AwesomeHttpService, MockBackend], (awesomeHttpService: AwesomeHttpService, backend: MockBackend) => {

      let apiEndPoint: string = 'http://foo.bar.com';

      let cacheGetSpy: Spy = spyOn(cacheService, 'get').and.callThrough();
      let cacheStoreSpy: Spy = spyOn(cacheService, 'store').and.callThrough();
      let httpGetSpy: Spy = spyOn(httpService, 'get').and.callThrough();

      backend.connections.subscribe(
        (connection: MockConnection) => {
          let mockResponseBody: any = {
            title: 'Me',
            content: 'Testing is a good thing'
          };

          let response = new ResponseOptions({body: JSON.stringify(mockResponseBody)});
          connection.mockRespond(new Response(response));
        }
      );

      awesomeHttpService.setConfig({useCache: true, forceUpdate: true});

      // 1st call that should store into cache
      let firstCall: Observable<Response> = awesomeHttpService.get(apiEndPoint);

      firstCall.subscribe(() => {
        // 2nd call that should retrieve from cache
        awesomeHttpService.get(apiEndPoint).subscribe();
      });


      // Expect 2 cache get
      expect(cacheGetSpy.calls.count()).toEqual(2);

      // Expect 1 cache store
      expect(cacheStoreSpy.calls.count()).toEqual(1);

      // Expect 1 GET request
      expect(httpGetSpy.calls.count()).toEqual(1);

    })
    )
  );

});
