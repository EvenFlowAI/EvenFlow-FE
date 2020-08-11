export type LinkType = {
    to: string;
    name: string;
}

export type ValidationKeyPairs<U> = {
    field: keyof U;
    message: string;
}

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
    refreshToken = 'rt'
}