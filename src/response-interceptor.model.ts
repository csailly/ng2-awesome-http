import {Response} from "@angular/http";

export interface ResponseInterceptor {
  afterResponse(response:Response):void
}
