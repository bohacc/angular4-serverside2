import { ActionReducer, Action } from '@ngrx/store'

import { Auth, AuthActions }     from '../'

var initialState: Auth = {
  error: null,
  token: null,
  current: null
};


export function authReducer(state: Auth = initialState, action: Action) {

  switch (action.type) {
    case AuthActions.AUTH_USER_AUTHENTICATED:
      return Object.assign({}, state, {token: action.payload.token, current: action.payload.user, error: null});

    case AuthActions.AUTH_LOGOUT_USER_SUCCESS:
      return Object.assign({}, initialState);

    case AuthActions.AUTH_LOGIN_USER_FAIL:
    case AuthActions.AUTH_SIGNUP_USER_FAIL:
    case AuthActions.AUTH_TOKEN_EXPIRED:
      return Object.assign({}, state, {error: action.payload.error, token: null, current: null});

    default:
      return state;
  }

}
