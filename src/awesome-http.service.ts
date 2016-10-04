import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ResponseInterceptor } from './response-interceptor.model';
import { RequestInterceptor } from './request-interceptor.model';
import { CacheService } from './cache/cache.service';
import { HttpConfig } from './cache/http-config.model';

@Injectable()
export class AwesomeHttpService {

  private _responseErrorInterceptors: ResponseInterceptor[];
  private _responseSuccessInterceptors: ResponseInterceptor[];
  private _requestInterceptors: RequestInterceptor[];
  private _globalHeaders: Headers;
  private _config: HttpConfig;

  constructor(private _cacheService: CacheService, private _http: Http) {
    console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', 'AwesomeHttpService constructor');
    this._responseErrorInterceptors = [];
    this._responseSuccessInterceptors = [];
    this._requestInterceptors = [];
    this._globalHeaders = new Headers();
    this._config = {useCache: false, baseUrl: '', forceUpdate: false};
  }

  public setConfig(config: HttpConfig): void {
    this._config.baseUrl = config.baseUrl || this._config.baseUrl;
    this._config.useCache = config.useCache || this._config.useCache;
    this._config.forceUpdate = config.forceUpdate || this._config.forceUpdate;
    this._config.ttl = config.ttl || this._config.ttl;
  }

  /**
   * Performs a request with `get` http method.
   */
  public get(url: string, options?: RequestOptionsArgs, httpConfig?: HttpConfig): Observable<Response> {
    let fullUrl: string = this.getBaseUrl(httpConfig) + url;

    console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', ' GET ', fullUrl);

    if (this.isUseCache(httpConfig) && !this.isForceUpdate(httpConfig)) {
      let fromCache = this._cacheService.get(fullUrl);
      if (fromCache) {
        console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', ' CACHE', fromCache);
        return Observable.of(fromCache);
      }
    }

    this.applyRequestInterceptors();

    let myoptions = this.applyGlobalHeaders(options);

    return this._http.get(fullUrl, myoptions)
      .flatMap(res => {
        console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', ' GET successful', res);
        this.applyResponseSuccessInterceptors(res);
        if (this.isUseCache(httpConfig)) {
          this._cacheService.store(fullUrl, res, this.getCacheTTL(httpConfig));
        }
        return Observable.of(res);
      })
      .catch(error => {
        console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', ' GET failed', error);
        this.applyResponseErrorInterceptors(error);
        return Observable.throw(error);
      });
  }


  /**
   * Performs a request with `post` http method.
   */
  public post(url: string, body: any, options?: RequestOptionsArgs, httpConfig?: HttpConfig): Observable<Response> {
    let fullUrl: string = this.getBaseUrl(httpConfig) + url;

    console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', ' POST ', fullUrl);

    this.applyRequestInterceptors();

    let myoptions = this.applyGlobalHeaders(options);

    return this._http.post(fullUrl, body, myoptions)
      .flatMap(res => {
        console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', ' POST successful', res);
        this.applyResponseSuccessInterceptors(res);
        return Observable.of(res);
      })
      .catch(error => {
        console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', ' POST failed', error);
        this.applyResponseErrorInterceptors(error);
        return Observable.throw(error);
      });

  }

  /**
   * Performs a request with `delete` http method.
   */
  public delete(url: string, options?: RequestOptionsArgs, httpConfig?: HttpConfig): Observable<Response> {
    let fullUrl: string = this.getBaseUrl(httpConfig) + url;

    console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', ' DELETE ', fullUrl);

    this.applyRequestInterceptors();

    let myoptions = this.applyGlobalHeaders(options);

    return this._http.delete(fullUrl, myoptions)
      .flatMap(res => {
        console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', 'successful', res);

        this.applyResponseSuccessInterceptors(res);
        return Observable.of(res);
      })
      .catch(error => {
        console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', ' DELETE failed', error);

        this.applyResponseErrorInterceptors(error);
        return Observable.throw(error);
      });
  }

  /**
   * Add a new Response interceptor
   * @param interceptor: the interceptor to add.
   */
  public addResponseErrorInterceptor(interceptor: ResponseInterceptor): void {
    console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', ' add Response Error Interceptor ');

    this._responseErrorInterceptors.push(interceptor);
  }

  /**
   * Add a new Response interceptor
   * @param interceptor: the interceptor to add.
   */
  public addResponseSuccessInterceptor(interceptor: ResponseInterceptor): void {
    console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•',
      ' add Response Success Interceptor ');

    this._responseSuccessInterceptors.push(interceptor);
  }

  /**
   * Add a new Request interceptor
   * @param interceptor: the interceptor to add.
   */
  public addRequestInterceptor(interceptor: RequestInterceptor): void {
    console.log('•?((¯°·._.• Awesome Http module •._.·°¯))؟•', ' add Request Interceptor ');

    this._requestInterceptors.push(interceptor);
  }

  /**
   * Add a new header on each request.
   * @param name: the header name
   * @param value: the header value
   */
  public addGlobalHeader(name: string, value: any): void {
    this._globalHeaders.append(name, value);
  }


  private applyGlobalHeaders(options: RequestOptionsArgs): RequestOptionsArgs {
    let myoptions = options || new RequestOptions({headers: new Headers()});
    for (const key of this._globalHeaders.keys()) {
      myoptions.headers.append(key, this._globalHeaders.get(key));
    }
    return myoptions;
  }

  private applyResponseErrorInterceptors(response: Response): void {
    for (const interceptor of this._responseErrorInterceptors) {
      interceptor.afterResponse(response);
    }
  }

  private applyResponseSuccessInterceptors(response: Response): void {
    for (const interceptor of this._responseSuccessInterceptors) {
      interceptor.afterResponse(response);
    }
  }

  private applyRequestInterceptors(): void {
    for (const interceptor of this._requestInterceptors) {
      interceptor.beforeRequest();
    }
  }

  private getBaseUrl(httpConfig?: HttpConfig): string {
    if (httpConfig && httpConfig.baseUrl) {
      return this.normalizeUrl(httpConfig.baseUrl);
    }
    return this.normalizeUrl(this._config.baseUrl);
  }

  private getCacheTTL(httpConfig?: HttpConfig): number {
    if (httpConfig && httpConfig.ttl) {
      return httpConfig.ttl;
    }
    return this._config.ttl;
  }

  private isForceUpdate(httpConfig?: HttpConfig): boolean {
    if (httpConfig && httpConfig.forceUpdate !== undefined) {
      return httpConfig.forceUpdate;
    }
    return this._config.forceUpdate;
  }

  private isUseCache(httpConfig?: HttpConfig): boolean {
    if (httpConfig && httpConfig.useCache !== undefined) {
      return httpConfig.useCache;
    }
    return this._config.useCache;
  }

  /**
   * Ensure url end with '/' character.
   * @param url
   * @returns {string}
   */
  private normalizeUrl(url: string): string {
    if (url[url.length - 1] !== '/') {
      return url + '/';
    }
    return url;
  }


}
