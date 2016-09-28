import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";

import {AwesomeHttpService} from "./awesome-http.service";
import {CacheService} from "./cache/cache.service";
export {CacheConfig} from "./cache/cache-config.model";
export {AwesomeHttpService} from "./awesome-http.service";

@NgModule({
  imports: [
    HttpModule
  ],
  providers: [AwesomeHttpService, CacheService]
})
export class AwesomeHttpModule {
}
