import {NgModule} from "@angular/core";
import {AwesomeHttpService} from "./awesome-http.service";
import {HttpModule} from "@angular/http";

@NgModule({
  imports: [
    HttpModule
  ],
  providers: [AwesomeHttpService]
})
export class AwesomeHttpModule{
}
