import {Http, ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers} from "@angular/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {Inject, Injectable} from "@angular/core";
//import { isBrowser } from 'angular2-universal';

declare var Zone: any;

/*!!! AT TIME, NOT USED WITH ANGULAR UNIVERSAL !!!*/

@Injectable()
export class HttpInterceptor extends Http {
  constructor(
    backend: ConnectionBackend,
    defaultOptions: RequestOptions,
    private _router: Router,
    @Inject('isBrowser') private isBrowser: Boolean
  ) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, options));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.get(url,options);
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.post(url, body, options));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.put(url, body, options));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.delete(url, options));
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    return observable.catch((err, source) => {
      return Observable.throw(err);
      /*if (err.status  == 401) {
        this._router.navigate(['/login']);
        return Observable.empty();
      } else {
        return Observable.throw(err);
      }*/
    });
  }
}
