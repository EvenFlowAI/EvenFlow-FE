import axios, {AxiosResponse} from "axios";
import {APIUrl} from "./config";
import {ICredentials, IRefreshTokenData, ITokens, LocalTokens} from "../types/types";
import {deflateRawSync} from "zlib";


class AuthService {
    getLocalToken (): string {
        return localStorage.getItem(LocalTokens.authToken) || '';
    }
    getRefreshToken (): string {
        return localStorage.getItem(LocalTokens.refreshToken) || '';
    }

    setTokens ({accessToken, refreshToken}: ITokens): void {
        localStorage.setItem(LocalTokens.authToken, accessToken);
        localStorage.setItem(LocalTokens.refreshToken, refreshToken);
    }

    isAuthenticated (): boolean {
        return !!this.getLocalToken();
    }

    refreshRequest (): void {
        const token = this.getLocalToken();
        if (token) {
            request.defaults.headers['Authorization'] = `Bearer ${token}`;
        } else {
            delete request.defaults.headers['Authorization'];
        }
    }

    async refresh() {
        try {
            const data: IRefreshTokenData =  {token: this.getRefreshToken()};
            const resp = await Api.call<ITokens>(Api.endpoints.Authentications.Refresh, data);
            this.setTokens(resp.data);
            this.refreshRequest();
        } catch (e) {
            this.logout();
            throw e;
        }
    }

    async login(credentials: ICredentials) {
        try {
            const resp= await Api.call<ITokens>(Api.endpoints.Authentications.Request, credentials);
            this.setTokens(resp.data);
            this.refreshRequest()
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    logout (): void {
        localStorage.removeItem(LocalTokens.authToken);
        localStorage.removeItem(LocalTokens.refreshToken);
        this.refreshRequest();
    }
}

export const authService = new AuthService();
export const request = axios.create({
    baseURL: APIUrl,
    headers: {Authentication: `Bearer ${authService.getLocalToken()}`}
});


type TApiRoute = {
    route: string;
    method:
        | "get"
        | "delete"
        | "options"
        | "post"
        | "put"
        | "patch";
}

type ApiRoutes = {
    Accounts: Record<"Recovery" | "Reset" | "Change" | "Verification" | "Profile" | "Dealership", TApiRoute>,
    Authentications: Record<"Request" | "Refresh", TApiRoute>,
}

export class Api {
    static endpoints: ApiRoutes = {
        Accounts: {
            Recovery: {
                route: "/accounts/password-recovery",
                method: "post"
            },
            Reset: {route: "/accounts/password-reset", method: "patch"},
            Change: {route: "/accounts/password-change", method: "patch"},
            Verification: {route: "/accounts/verification", method: "patch"},
            Profile: {route: "/accounts/profile", method: "get"},
            Dealership: {route: "/accounts/dealership", method: "get"},
        },
        Authentications: {
            Request: {route: "/authentications", method: "post"},
            Refresh: {route: "/authentications/refresh", method: "post"},
        }
    };
    static async call<RValue=any>(r: TApiRoute, data?: any) {
        if (r.method === "post" || r.method === "put" || r.method === "patch") {
            return request[r.method]<RValue, AxiosResponse<RValue>>(r.route, data);
        } else {
            return request[r.method]<RValue, AxiosResponse<RValue>>(r.route);
        }
    }
}
