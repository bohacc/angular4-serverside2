export interface Auth {
  token: string;
  error: string;
  current: AuthUser;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  emailConfirm: Boolean;
  avatarUrl: string;
}
