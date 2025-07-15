export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenData {
  token: string;
}

export interface ICredentials {
  email: string;
  password: string;
}

export enum LocalTokens {
  authToken = 'at',
  refreshToken = 'rt',
  suToken = 'st',
  sessionId = 'sessionId',
}

export enum SelfCustomTokens {
  authToken = 'at_self',
  refreshToken = 'rt_self',
}
