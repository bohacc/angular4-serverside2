import 'rxjs/add/operator/do'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/merge'

import { Inject, Injectable }                                             from '@angular/core'
import { BehaviorSubject, Observable }                                    from 'rxjs/Rx'
import { Action, Reducer, Store }                                         from '@ngrx/store'

import { AuthService, AuthServiceInterface, Auth, AuthUser, AuthActions } from '../'

@Injectable()
export class AuthModelService {
  error$: Observable<string>;
  token$: Observable<string>;
  current$: Observable<AuthUser>;

  private actions$ = new BehaviorSubject<Action>({type: AuthActions.INIT, payload: null});

  constructor(
    @Inject(AuthService) private _auth: AuthServiceInterface,
    private _store: Store<any>
  ) {
    const store$ = this._store.select<Auth>('auth');

    this.error$ = store$.map(data => data['error']);
    this.token$ = store$.map(data => data['token']);
    this.current$ = store$.map(data => data['current']);

    let logins = this.actions$
      .filter(action => action.type === AuthActions.AUTH_LOGIN_USER)
      .do(() => _store.dispatch({type: AuthActions.AUTH_LOGIN_USER_IN_PROGRESS}))
      .mergeMap(action => _auth.login(action.payload.email, action.payload.password)).share();

    let loginSuccess$ = logins.filter((payload: Auth) => payload.token !== null)
      .map((payload) => ({type: AuthActions.AUTH_USER_AUTHENTICATED, payload}));
    let loginFailure$ = logins.filter((payload: Auth) => payload.token === null)
      .map((payload) => ({type: AuthActions.AUTH_LOGIN_USER_FAIL, payload}));

    let signups = this.actions$
      .filter(action => action.type === AuthActions.AUTH_SIGNUP_USER)
      .do(() => _store.dispatch({type: AuthActions.AUTH_SIGNUP_USER_IN_PROGRESS}))
      .mergeMap(action => _auth.signupAndLogin(action.payload.email, action.payload.password)).share();

    let signupSuccess$ = signups.filter((payload: Auth) => payload.token !== null)
      .map((payload) => ({type: AuthActions.AUTH_USER_AUTHENTICATED, payload}));
    let signupFailure$ = signups.filter((payload: Auth) => payload.token === null)
      .map((payload) => ({type: AuthActions.AUTH_SIGNUP_USER_FAIL, payload}));

    let inits = this.actions$
      .filter(action => action.type === AuthActions.AUTH_INIT)
      .do(() => _store.dispatch({type: AuthActions.AUTH_INIT_IN_PROGRESS}))
      .mergeMap(action => _auth.initAuth()).share();

    let initSuccess$ = inits.filter((payload: Auth) => payload.token !== null)
      .map((payload) => ({type: AuthActions.AUTH_USER_AUTHENTICATED, payload}));
    let initFailure$ = inits.filter((payload: Auth) => payload.token === null)
      .map((payload) => ({type: AuthActions.AUTH_INIT_FAIL, payload}));

    let logouts = this.actions$
      .filter(action => action.type === AuthActions.AUTH_LOGOUT_USER)
      .do(() => _store.dispatch({type: AuthActions.AUTH_LOGOUT_USER_IN_PROGRESS}))
      .do(() => _auth.logout())
      .map(() => ({type: AuthActions.AUTH_LOGOUT_USER_SUCCESS}));

    Observable
      .merge(loginSuccess$, loginFailure$, signupSuccess$, signupFailure$, initSuccess$, initFailure$, logouts)
      .subscribe((action: Action) => _store.dispatch(action));
  }

  signup(email, password): void {
    this.actions$.next({type: AuthActions.AUTH_SIGNUP_USER, payload: {email, password}});
  }

  login(email, password): void {
    this.actions$.next({type: AuthActions.AUTH_LOGIN_USER, payload: {email, password}});
  }

  logout(): void {
    this.actions$.next({type: AuthActions.AUTH_LOGOUT_USER});
  }

  initAuth(): void {
    this.actions$.next({type: AuthActions.AUTH_INIT});
  }

}
