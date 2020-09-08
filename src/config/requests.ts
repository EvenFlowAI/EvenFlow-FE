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
    Bays: Record<"Create" | "Update" | "Remove" | "Retrieve" | "GetAll" | "GetShort", TApiRoute>,
    Dealerships: Record<"Create" | "GetShort" | "Retrieve" | "Remove" | "Update" | "GetAll"
        | "UpdateAddress" | "UploadAvatar", TApiRoute>,
    Employees: Record<"Create" | "Update" | "GetAll", TApiRoute>,
    ServiceCenters: Record<"Create" | "GetShort" | "Update" | "Remove" | "Retrieve" | "UpdateAddress"
        | "GetAll" | "Avatar" | "GetHOO" | "SetHOO" | "GetWS" | "SetWS" | "WorkingDays"
        | "GetBreaks" | "SetBreaks", TApiRoute>,
    Users: Record<"GetAll" | "Create" | "Update" | "Remove" | "Avatar", TApiRoute>,
    Holidays: Record<"Create" | "Update" | "Remove" | "Retrieve" | "GetAll", TApiRoute>,
    ValueSettings: Record<"GetValue" | "SetValue" | "GetCL" | "SetCL" | "GetCTS" | "SetCTS"
        | "GetWS" | "SetWS", TApiRoute>
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
        Bays: {
            Create: {route: "/bays", method: "post"},
            Update: {route: "/bays/{id}", method: "put"},
            Remove: {route: "/bays/{id}", method: "delete"},
            Retrieve: {route: "/bays/{id}", method: "get"},
            GetAll: {route: "/bays/by-query", method: "post"},
            GetShort: {route: "/bays/short-by-query", method: "post"},
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
        Employees: {
            Create: {route: "/employees", method: "post"},
            Update: {route: "/employees/{id}", method: "put"},
            GetAll: {route: "/employees/by-query", method: "post"}
        },
        ServiceCenters: {
            Create: {route: "/service-centers", method: "post"},
            GetShort: {route: "/service-centers", method: "get"},
            Update: {route: "/service-centers/{id}", method: "put"},
            Remove: {route: "/service-centers/{id}", method: "delete"},
            Retrieve: {route: "/service-centers/{id}", method: "get"},
            UpdateAddress: {route: "/service-centers/{id}/address", method: "put"},
            GetAll: {route: "/service-centers/by-query", method: "post"},
            Avatar: {route: "/service-centers/{id}/avatar", method: "patch"},
            GetHOO: {route: "/service-centers/{id}/hours-of-operations", method: "get"},
            SetHOO: {route: "/service-centers/{id}/hours-of-operations", method: "put"},
            GetWS: {route: "/service-centers/{id}/weekly-schedules", method: "get"},
            SetWS: {route: "/service-centers/{id}/weekly-schedules", method: "put"},
            GetBreaks: {route: "/service-centers/{id}/breaks", method: "get"},
            SetBreaks: {route: "/service-centers/{id}/breaks", method: "put"},
            WorkingDays: {route: "/service-centers/{id}/working-days", method: "get"},
        },
        Users: {
            GetAll: {route: "/users/by-query", method: "post"},
            Create: {route: "/users", method: "post"},
            Remove: {route: "/users/{id}", method: "delete"},
            Update: {route: "/users/{id}", method: "put"},
            Avatar: {route: "/users/{id}/avatar", method: "patch"}
        },
        Holidays: {
            GetAll: {route: "/holidays/by-query", method: "post"},
            Retrieve: {route: "/holidays/{id}", method: "get"},
            Remove: {route: "/holidays/{id}", method: "delete"},
            Update: {route: "/holidays/{id}", method: "put"},
            Create: {route: "/holidays", method: "post"},
        },
        ValueSettings: {
            GetValue: {route: "/value-settings", method: "get"},
            SetValue: {route: "/value-settings", method: "put"},
            GetCL: {route: "/customer-lifetimes", method: "get"},
            SetCL: {route: "/customer-lifetimes", method: "put"},
            GetCTS: {route: "/customer-type-settings", method: "get"},
            SetCTS: {route: "/customer-type-settings", method: "put"},
            GetWS: {route: "/warranty-settings", method: "get"},
            SetWS: {route: "/warranty-settings", method: "put"},
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
