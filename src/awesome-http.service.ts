import {Injectable} from "@angular/core";
import {Http, RequestOptionsArgs, Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {ResponseInterceptor} from "./response-interceptor.model";
import {RequestInterceptor} from "./request-interceptor.model";
import {CacheService} from "./cache/cache.service";
import {CacheConfig} from "./cache/cache-config.model";

@Injectable()
export class AwesomeHttpService {

  private _responseErrorInterceptors: ResponseInterceptor[];
  private _responseSuccessInterceptors: ResponseInterceptor[];
  private _requestInterceptors: RequestInterceptor[];
  private _globalHeaders: Headers;

  constructor(private _cacheService: CacheService, private _http: Http) {
    console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", "Module constructor");
    this._responseErrorInterceptors = [];
    this._responseSuccessInterceptors = [];
    this._requestInterceptors = [];
    this._globalHeaders = new Headers();
  }

  /**
   * Performs a request with `get` http method.
   */
  get(url: string, options?: RequestOptionsArgs, cacheConfig?: CacheConfig): Observable<Response> {
    console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " GET ", url);


    if (cacheConfig && cacheConfig.useCache && !cacheConfig.forceUpdate) {
      let fromCache = this._cacheService.get(url);
      if (fromCache) {
        console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " CACHE", fromCache);
        return Observable.of(fromCache);
      }
    }

    this.applyRequestInterceptors();

    let myoptions = this.applyGlobalHeaders(options);

    return this._http.get(url, myoptions)
      .flatMap(res => {
        console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " GET successful", res);
        this.applyResponseSuccessInterceptors(res);
        if (cacheConfig && cacheConfig.useCache) {
          this._cacheService.store(url, res, cacheConfig.ttl);
        }
        return Observable.of(res);
      })
      .catch(error => {
        console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " GET failed", error);
        this.applyResponseErrorInterceptors(error);
        return Observable.throw(error);
      });
  }


  /**
   * Performs a request with `post` http method.
   */
  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " POST ", url);

    this.applyRequestInterceptors();

    let myoptions = this.applyGlobalHeaders(options);

    return this._http.post(url, body, myoptions)
      .flatMap(res => {
        console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " POST successful", res);
        this.applyResponseSuccessInterceptors(res);
        return Observable.of(res);
      })
      .catch(error => {
        console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " POST failed", error);
        this.applyResponseErrorInterceptors(error);
        return Observable.throw(error);
      });

  }

  /**
   * Performs a request with `delete` http method.
   */
  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " DELETE ", url);

    this.applyRequestInterceptors();

    let myoptions = this.applyGlobalHeaders(options);

    return this._http.delete(url, myoptions)
      .flatMap(res => {
        console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", "successful", res);

        this.applyResponseSuccessInterceptors(res);
        return Observable.of(res);
      })
      .catch(error => {
        console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " DELETE failed", error);

        this.applyResponseErrorInterceptors(error);
        return Observable.throw(error);
      });
  }

  /**
   * Add a new Response interceptor
   * @param interceptor: the interceptor to add.
   */
  addResponseErrorInterceptor(interceptor: ResponseInterceptor): void {
    console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " add Response Error Interceptor ");

    this._responseErrorInterceptors.push(interceptor);
  }

  /**
   * Add a new Response interceptor
   * @param interceptor: the interceptor to add.
   */
  addResponseSuccessInterceptor(interceptor: ResponseInterceptor): void {
    console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " add Response Success Interceptor ");

    this._responseSuccessInterceptors.push(interceptor);
  }

  /**
   * Add a new Request interceptor
   * @param interceptor: the interceptor to add.
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    console.log("•?((¯°·._.• Awesome Http module •._.·°¯))؟•", " add Request Interceptor ");

    this._requestInterceptors.push(interceptor);
  }

  /**
   * Add a new header on each request.
   * @param name: the header name
   * @param value: the header value
   */
  addGlobalHeader(name: string, value: any): void {
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


}
