import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'

import { Inject, Injectable }                      from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable }                              from 'rxjs/Observable'
import gql                                         from 'graphql-tag'

import { ApiService }                              from '../../shared'
import { AuthServiceInterface }                    from '../'

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
export class ServerAuthService implements AuthServiceInterface {

  private baseUrl = 'https://heystitchio.auth0.com';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers })

  constructor(
    @Inject('req') private _req: any,
    private _api: ApiService,
    private _http: Http
  ) {}

  public signupAndLogin(): void {
    throw new Error("Signup event cannot be called while doing server side rendering");
  }

  public login(): void {
    throw new Error("Login event cannot be called while doing server side rendering");
  }

  public logout(): void {
    throw new Error("Logout event cannot be called while doing server side rendering");
  }

  public initAuth(): Observable<Object> {
    var token: String = this._req.cookies.USID || null;

    if (token !== null) {
      return this._getUserInfo(token)
        .flatMap(data => this._getUserFromDatabase(data['token'], data['user']['user_id']))
        .catch((err: any) => Observable.of({ error: err, token: null, user: null }));
    } else {
      return Observable.of({ token: null });
    }
  }

  private _getUserInfo(token: String): Observable<String> {
    var payload = {
            "id_token": token
          };
    return this._http.post(`${this.baseUrl}/tokeninfo`, payload, this.options)
      .map(response => { return { user: response.json(), token: token }})
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
