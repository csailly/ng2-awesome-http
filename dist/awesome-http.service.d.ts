import { Http, RequestOptionsArgs, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { ResponseInterceptor } from "./response-interceptor.model";
import { RequestInterceptor } from "./request-interceptor.model";
import { CacheService } from "./cache/cache.service";
import { CacheConfig } from "./cache/cache-config.model";
export declare class AwesomeHttpService {
    private _cacheService;
    private _http;
    private _responseErrorInterceptors;
    private _responseSuccessInterceptors;
    private _requestInterceptors;
    private _globalHeaders;
    constructor(_cacheService: CacheService, _http: Http);
    /**
     * Performs a request with `get` http method.
     */
    get(url: string, options?: RequestOptionsArgs, cacheConfig?: CacheConfig): Observable<Response>;
    /**
     * Performs a request with `post` http method.
     */
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>;
    /**
     * Performs a request with `delete` http method.
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<Response>;
    /**
     * Add a new Response interceptor
     * @param interceptor: the interceptor to add.
     */
    addResponseErrorInterceptor(interceptor: ResponseInterceptor): void;
    /**
     * Add a new Response interceptor
     * @param interceptor: the interceptor to add.
     */
    addResponseSuccessInterceptor(interceptor: ResponseInterceptor): void;
    /**
     * Add a new Request interceptor
     * @param interceptor: the interceptor to add.
     */
    addRequestInterceptor(interceptor: RequestInterceptor): void;
    /**
     * Add a new header on each request.
     * @param name: the header name
     * @param value: the header value
     */
    addGlobalHeader(name: string, value: any): void;
    private applyGlobalHeaders(options);
    private applyResponseErrorInterceptors(response);
    private applyResponseSuccessInterceptors(response);
    private applyRequestInterceptors();
}
