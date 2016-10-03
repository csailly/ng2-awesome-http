# ng2-awesome-http

## Installation

To install this library, run:

```bash
$ npm install ng2-awesome-http --save
```

## Setup

```
import { NgModule } from '@angular/core';
import { AwesomeHttpModule, AwesomeHttpService } from 'ng2-awesome-http';

@NgModule({
  imports: [
    AwesomeHttpModule
  ]
})
export class AppModule {}
```

## Features

### Simple Http request

Use as Angular http module

```
  public getUser(userCode): Observable<any> {
    return this.awesomeHttpService.get('http://foo/api/users/' + userCode)
      .map(res => res.json());
  }
```

### Request configuration

You have the possibility to configure each request

```
  public getUser(userCode): Observable<any> {
    return this.awesomeHttpService.get('users/' + userCode, null, {baseUrl: 'http://foo/api', useCache: true, forceUpdate: true})
      .map(res => res.json());
   }
```


### Global configuration

You can set global options for all request

```
import { NgModule } from '@angular/core';
import { AwesomeHttpModule, AwesomeHttpService } from 'ng2-awesome-http';

@NgModule({
  imports: [
    AwesomeHttpModule
  ]
})
export class AppModule {
  constructor(private _awesomeHttpService: AwesomeHttpService) {
    this._awesomeHttpService.setConfig({baseUrl: 'http://foo/api', useCache: true});
  }
}
```


```
  public getUser(userCode): Observable<any> {
    return this.awesomeHttpService.get('users/' + userCode)
      .map(res => res.json());
  }
```

### Configuration options
- baseUrl : Base url to use on each request. default : ''
- useCache : enable/disable cache for GET request. default : false
- ttl: ttl for cache. default : undefined
- forceUpdate: when cache is enable, force to update it.

### Add request interceptor
You can add an interceptor on request
```
        this._awesomeHttpService.addRequestInterceptor({
            beforeRequest(): void {
                //Put here your code
                ...
            }
        });

```

### Add response interceptor
You can add an interceptor on response error
```
        this._awesomeHttpService.addResponseErrorInterceptor({
            afterResponse(response: Response): void {
                //Put here your code
                ...
            }
        });
```

You can add an interceptor on response success
```
        this._awesomeHttpService.addResponseSuccessInterceptor({
            afterResponse(response: Response): void {
                //Put here your code
                ...
            }
        });
```

### Add global header
You can set an header to be added on each request

```
  this._awesomeHttpService.addGlobalHeader('Authorization', 'token jkfsdf82fsdhfsdf8');
```

## Development

To generate all `*.js`, `*.js.map` and `*.d.ts` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Christophe Sailly](christophe.sailly@gmail.com)
