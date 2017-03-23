import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import { Subscription }                                                     from 'rxjs/Subscription'

import { Injectable }                                                       from '@angular/core'
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable }                                                       from 'rxjs/Observable'
import { AuthModelService }                                                 from '../../auth';

@Injectable()
export class CanActivateWithAuthGuard implements CanActivate {

  private _tokenSubscription: Subscription;

  constructor(
    private _auth: AuthModelService,
    private _router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Boolean> {
    var result: String;

    this._tokenSubscription = this._auth.token$.subscribe(token => {
      result = token;
    });

    if (!result) this._router.navigate(['/login', { return: state.url }]);
    return Observable.of(!!result);
  }

}
