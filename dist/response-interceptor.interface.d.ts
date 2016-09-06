import { Response } from "@angular/http";
export interface IResponseInterceptor {
    afterResponse(response: Response): void;
}
