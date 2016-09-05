import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";

import {AwesomeHttpService} from "./awesome-http.service";
export {AwesomeHttpService} from "./awesome-http.service";


@NgModule({
  imports: [
    HttpModule
  ],
  providers: [AwesomeHttpService]
})
export class AwesomeHttpModule {
}
