import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'

import { Injectable }                              from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable }                              from 'rxjs/Observable'
import { CookieService }                           from 'angular2-cookie/services/cookies.service'
import gql                                         from 'graphql-tag'

import { ApiService }                              from '../../shared'
import { AuthServiceInterface }                    from '../'

const createUserMutation = gql`
  mutation createUser($idToken: String!, $username: String!, $email: String!, $emailConfirm: Boolean!, $avatarUrl: String!) {
    createUser(authProvider: {auth0: {idToken: $idToken}}, username: $username, email: $email, emailConfirm: $emailConfirm, avatarUrl: $avatarUrl) {
      id
      username
      email
      emailConfirm
      avatarUrl
    }
  }
`

const authUserQuery = gql`
  query User($idToken: String!) {
    User(auth0UserId: $idToken) {
      id
      avatarUrl
      email
      emailConfirm
      username
      notifications {
        id
      }
      chats {
        id
      }
      followedProjects {
        id
      }
    }
  }
`


@Injectable()
export class BrowserAuthService implements AuthServiceInterface {

  private baseUrl = 'https://heystitchio.auth0.com';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers })

  constructor(
    private _cookies: CookieService,
    private _api: ApiService,
    private _http: Http
  ) {}

  public signupAndLogin(email: String, password: String): Observable<any> {
    return this._signupUser(email, password)
      .flatMap(data => this._authenticateUser(data['email'], password))
      .flatMap(data => this._getUserInfo(data['id_token']))
      .flatMap(data => this._createUserInDatabase(data['user']))
      .catch((err: any) => Observable.of({ error: err, token: null, user: null }));
  }

  public login(email: String, password: String): Observable<any> {
    var error = null;

    return this._authenticateUser(email, password)
      .flatMap(data => this._getUserInfo(data['id_token']))
      .flatMap(data => this._getUserFromDatabase(data['token'], data['user']['user_id']))
      .catch((err: any) => Observable.of({ error: err, token: null, user: null }));
  }

  public logout(): void {
    this._removeAccessCookies();
  }

  public initAuth(): Observable<Object> {
    var token = this._cookies.get('USID') || null;

    if (token !== null) {
      return this._getUserInfo(token)
        .flatMap(data => this._getUserFromDatabase(data['token'], data['user']['user_id']))
        .catch((err: any) => Observable.of({ error: err, token: null, user: null }));
    } else {
      return Observable.of({ token: null });
    }
  }

  private _signupUser(email: String, password: String): Observable<String> {
    var payload = {
      "client_id": "mSKfZ1UMwag0Vibr2DzbURdX6wgf5z72",
      "email": email,
      "password": password,
      "connection": "Username-Password-Authentication"
    };
    return this._http.post(`${this.baseUrl}/dbconnections/signup`, payload, this.options)
      .map(response => response.json())
      .catch(this._handleError);
  }

  private _authenticateUser(email: String, password: String): Observable<String> {
    var payload = {
      "client_id": "mSKfZ1UMwag0Vibr2DzbURdX6wgf5z72",
      "connection": "Username-Password-Authentication",
      "grant_type": "password",
      "username": email,
      "password": password,
      "scope": "openid name email email_verified"
    };
    return this._http.post(`${this.baseUrl}/oauth/ro`, payload, this.options)
      .map(response => response.json())
      .flatMap(response => this._setAccessCookies(response))
      .catch(this._handleError);
  }

  private _getUserInfo(token: String): Observable<Object> {
    var payload = {
            "id_token": token
          };
    return this._http.post(`${this.baseUrl}/tokeninfo`, payload, this.options)
      .map(response => { return { user: response.json(), token: token }})
      .catch(this._handleError);
  }

  private _createUserInDatabase(user: Object): Observable<Object> {
    var token = this._cookies.get('USID'),
        query = {
          mutation: createUserMutation,
          variables: {
            "idToken": token,
            "username": user['name'],
            "email": user['email'],
            "emailConfirm": user['email_verified'],
            "avatarUrl": `https://api.adorable.io/avatars/100/${token}.png`
          }
        };
    return this._api.mutate(query)
      .map(response => { return { error: null, token: token, user: response.data.createUser }})
      .catch(this._handleError);
  }

  private _getUserFromDatabase(token: String, authId: String): Observable<Object> {
    var query = {
          query: authUserQuery,
          variables: {
            "idToken": authId
          }
        };
    return this._api.query(query)
      .map(response => { return { error: null, token: token, user: response.data.User }})
      .catch(this._handleError);
  }

  private _setAccessCookies(response: String): Observable<String> {
    try {
      this._cookies.put('AUID', response['access_token']);
      this._cookies.put('USID', response['id_token']);
    }
    catch (error) {
      throw (Error(`browser.auth.service.ts[setAccessCookies()] => ${error}` || 'browser.auth.service.ts[setAccessCookies()] => An unknown error occurred.'));
    }
    return Observable.of(response);
  }

  private _removeAccessCookies(): void {
    try {
      this._cookies.remove('AUID');
      this._cookies.remove('USID');
    }
    catch (error) {
      throw (Error(`browser.auth.service.ts[removeAccessCookies()] => ${error}` || 'browser.auth.service.ts[removeAccessCookies()] => An unknown error occurred.'));
    }
  }

  private _handleError(error: Response | any): Observable<String> {

    let errorMessage: String;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || body;
      const status = err.statusCode || error.status || body.status || 0;
      const code = err.code || err || '';

      switch (status) {
        case 400:
          switch(code) {
            case 'user_exists':
              errorMessage = 'An account with that email already exists. Try logging in instead.';
              break;
            case 'username_exists':
              errorMessage = 'An account with that email already exists. Try logging in instead.';
              break;
            case 'email_exists':
              errorMessage = 'An account with that email already exists. Try logging in instead.';
              break;
            case 'password_invalid':
              errorMessage = 'The force is not string with that password. Please try a stronger one.';
              break;
            default:
              errorMessage = 'Whoops! Something went wrong with our service. We\'ve logged your error and will look into it ASAP.';
          }
          break;
        case 401:
          switch(code) {
            case 'invalid_user_password':
              errorMessage = 'Uh-oh, looks like your email or password isn\'t right. Please try again.';
              break;
            case 'unauthorized':
              errorMessage = 'You\ve been blocked from this service. Please contact our support for more information.';
              break;
            case 'password_leaked':
              errorMessage = 'Oh no! We\'ve blocked your login because your password has been leaked somewhere else. Check your email for instructions on how to unblock it.';
              break;
            default:
              errorMessage = 'Whoops! Something went wrong with our service. We\'ve logged your error and will look into it ASAP.';
          }
          break;
        case 404:
          errorMessage = 'We couldn\'t find you in our database! We\'ve logged this and will look into it ASAP.';
          break;
        case 429:
          errorMessage = 'Our service is overwhelmed right now. Please try again in a moment.';
          break;
        default:
          errorMessage = 'Whoops! Something went wrong with our service. We\'ve logged your error and will look into it ASAP.';
      }
    } else {
      errorMessage = error.message ? error.message : 'Whoops! Something went wrong with our service. We\'ve logged your error and will look into it ASAP.';
    }

    return Observable.throw(errorMessage);
  }
  
}
