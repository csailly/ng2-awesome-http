import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AwesomeHttpService } from './awesome-http.service';
import { CacheService } from './cache/cache.service';
export { AwesomeHttpService } from './awesome-http.service';
export { HttpConfig } from './cache/http-config.model';

@NgModule({
  imports: [
    HttpModule
  ],
  providers: [AwesomeHttpService, CacheService]
})
export class AwesomeHttpModule {
}
