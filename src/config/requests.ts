import axios, {AxiosResponse} from "axios";
import {APIUrl} from "./config";
import {ICredentials, IRefreshTokenData, ITokens, LocalTokens} from "../types/types";
import {pathReplace} from "../utils/utils";


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
            request.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete request.defaults.headers['Authorization'];
            delete request.defaults.headers.common['Authorization'];
        }
    }

    async refresh() {
        try {
            const data: IRefreshTokenData =  {token: this.getRefreshToken()};
            const resp = await Api.call<ITokens>(Api.endpoints.Authentications.Refresh, {data});
            this.setTokens(resp.data);
            this.refreshRequest();
        } catch (e) {
            this.logout();
            throw e;
        }
    }

    async login(data: ICredentials) {
        try {
            const resp = await Api.call<ITokens>(Api.endpoints.Authentications.Request, {data});
            this.setTokens(resp.data);
            this.refreshRequest();
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
    headers: {Authorization: `Bearer ${authService.getLocalToken()}`}
});

request.interceptors.response.use(
    resp => resp,
    async error => {
        if (error?.response?.status === 401 && authService.getRefreshToken()) {
            const rq = error.config;
            try {
                await authService.refresh();
                rq.headers['Authorization'] = `Bearer ${authService.getLocalToken()}`;
                return request(rq);
            } catch (e) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
)


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
    Dealerships: Record<"Create" | "GetShort" | "Retrieve" | "Remove" | "Update" | "GetAll" | "UpdateAddress" | "UploadAvatar", TApiRoute>,
    Users: Record<"GetAll", TApiRoute>,
}

type TOptions = {
    data?: any,
    params?: Record<string, any>,
    urlParams?: Record<string, any>
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
        },
        Dealerships: {
            Create: {route: "/dealerships", method: "post"},
            GetShort: {route: "/dealerships", method: "get"},
            GetAll: {route: "/dealerships/by-query", method: "post"},
            Remove: {route: "/dealerships/{id}", method: "delete"},
            Retrieve: {route: "/dealerships/{id}", method: "get"},
            Update: {route: "/dealerships/{id}", method: "put"},
            UpdateAddress: {route: "/dealerships", method: "put"},
            UploadAvatar: {route: "/dealerships/{id}/avatar", method: "patch"}
        },
        Users: {
            GetAll: {route: "/users/by-query", method: "post"}
        }
    };
    static async call<RValue=any>(r: TApiRoute, options?: TOptions) {
        const path = pathReplace(r.route, options?.urlParams);
        if (r.method === "post" || r.method === "put" || r.method === "patch") {
            return request[r.method]<RValue, AxiosResponse<RValue>>(path, options?.data);
        } else {
            return request[r.method]<RValue, AxiosResponse<RValue>>(path, {params: options?.params});
        }
    }
}
