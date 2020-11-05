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
    AppointmentAllocation: Record<"SetTimeWindows" | "GetTimeWindows"
        | "CreateDemandSegment" | "GetDemandSegments"
        | "BatchUpdateDemandSegments" | "RemoveDemandSegment"
        | "SetUnplanned" | "GetUnplanned", TApiRoute>,
    Authentications: Record<"Request" | "Refresh", TApiRoute>,
    Bays: Record<"Create" | "Update" | "Remove" | "Retrieve" | "GetAll" | "GetShort", TApiRoute>,
    Dealerships: Record<"Create" | "GetShort" | "Retrieve" | "Remove" | "Update" | "GetAll"
        | "UpdateAddress" | "UploadAvatar", TApiRoute>,
    Employees: Record<"Create" | "Update" | "GetAll", TApiRoute>,
    EmployeeSchedule: Record<"Create" | "Update" | "GetAll" | "Retrieve" | "Remove", TApiRoute>,
    OptimizationWindows: Record<"GetParams" | "SetParams" | "GetOverbooking" | "SetOverbooking", TApiRoute>,
    Offers: Record<"Create" | "GetAll" | "Retrieve" | "Edit" | "ChangeStatus" | "Remove", TApiRoute>,
    Pods: Record<"Create" | "Update" | "Retrieve" | "GetAll" | "Remove" | "GetShort", TApiRoute>,
    ServiceCenters: Record<"Create" | "GetShort" | "Update" | "Remove" | "Retrieve" | "UpdateAddress"
        | "GetAll" | "Avatar" | "GetHOO" | "SetHOO" | "GetWS" | "SetWS" | "WorkingDays"
        | "GetBreaks" | "SetBreaks", TApiRoute>,
    ServiceRequests: Record<"Create" | "Remove" | "Update" | "Retrieve" | "GetFiltered"
        | "UpdateStatus" | "CreateOverrides" | "EditOverrides" | "GetSROverrides"
        | "GetAssignedOverrides" | "AssignMultiple" | "RemoveOverride" | "GetShort"
        | "EditSkills" | "Prioritize", TApiRoute>,
    SlotScoring: Record<"SetProximity" | "GetProximity" | "SetDesirability" | "GetDesirability"
        | "SetOptimization" | "GetOptimization" | "SetValues", TApiRoute>,
    Users: Record<"GetAll" | "Create" | "Update" | "Remove" | "Retrieve" | "Avatar" | "GetShort", TApiRoute>,
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
        AppointmentAllocation: {
            SetTimeWindows: {route: "/appointment-allocations/time-windows", method: "put"},
            GetTimeWindows: {route: "/appointment-allocations/time-windows", method: "get"},
            CreateDemandSegment: {route: "/appointment-allocations/demand-segments", method: "post"},
            GetDemandSegments: {route: "/appointment-allocations/demand-segments", method: "get"},
            BatchUpdateDemandSegments: {route: "/appointment-allocations/demand-segments", method: "put"},
            RemoveDemandSegment: {route: "/appointment-allocations/demand-segments/{id}", method: "delete"},
            SetUnplanned: {route: "/appointment-allocations/unplanned-demand-segments", method: "put"},
            GetUnplanned: {route: "/appointment-allocations/unplanned-demand-segments", method: "get"},
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
        EmployeeSchedule: {
            Create: {route: "/employee-schedules", method: "post"},
            Retrieve: {route: "/employee-schedules/{id}", method: "get"},
            Update: {route: "/employee-schedules", method: "put"},
            Remove: {route: "/employee-schedules/{id}", method: "delete"},
            GetAll: {route: "/employee-schedules/by-query", method: "post"}
        },
        OptimizationWindows: {
            GetParams: {route: "/optimization-windows", method: "get"},
            SetParams: {route: "/optimization-windows", method: "put"},
            GetOverbooking: {route: "/optimization-windows/overbooking-factor", method: "get"},
            SetOverbooking: {route: "/optimization-windows/overbooking-factor", method: "put"},
        },
        Offers: {
            Create: {route: "/offers", method: "post"},
            GetAll: {route: "/offers/by-query", method: "post"},
            Retrieve: {route: "/offers/{id}", method: "get"},
            Edit: {route: "/offers/{id}", method: "put"},
            ChangeStatus: {route: "/offers/{id}/status", method: "patch"},
            Remove: {route: "/offers/{id}", method: "delete"},
        },
        Pods: {
            Create: {route: "/pods", method: "post"},
            Update: {route: "/pods/{id}", method: "put"},
            Retrieve: {route: "/pods/{id}", method: "get"},
            Remove: {route: "/pods/{id}", method: "delete"},
            GetAll: {route: "/pods/by-query", method: "post"},
            GetShort: {route: "/pods/short-by-query", method: "post"},
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
        ServiceRequests: {
            Create: {route: "/service-requests", method: "post"},
            Remove: {route: "/service-requests/{id}", method: "delete"},
            Update: {route: "/service-requests/{id}", method: "put"},
            Retrieve: {route: "/service-requests/{id}", method: "get"},
            GetFiltered: {route: "/service-requests/by-query", method: "post"},
            UpdateStatus: {route: "/service-requests/{id}/status", method: "patch"},
            CreateOverrides: {route: "/service-requests/{id}/overrides", method: "post"},
            EditOverrides: {route: "/service-requests/overrides/{id}", method: "put"},
            GetSROverrides: {route: "/service-requests/overrides/{id}", method: "get"},
            GetAssignedOverrides: {route: "/service-requests/overrides", method: "get"},
            RemoveOverride: {route: "/service-requests/overrides/{id}", method: "delete"},
            AssignMultiple: {route: "/service-requests/overrides", method: "post"},
            GetShort: {route: "/service-requests/overrides/short-by-query", method: "get"},
            EditSkills: {route: "/service-requests/required-skills", method: "patch"},
            Prioritize: {route: "/service-requests/prioritize", method: "patch"}
        },
        SlotScoring: {
            SetProximity: {route: "/slot-scoring/proximity", method: "put"},
            GetProximity: {route: "/slot-scoring/proximity", method: "get"},
            SetDesirability: {route: "/slot-scoring/desirability", method: "put"},
            GetDesirability: {route: "/slot-scoring/desirability", method: "get"},
            SetOptimization: {route: "/slot-scoring/optimization-settings", method: "put"},
            GetOptimization: {route: "/slot-scoring/optimization-settings", method: "get"},
            SetValues: {route: "/slot-scoring/optimization-settings/values", method: "put"}
        },
        Users: {
            GetAll: {route: "/users/by-query", method: "post"},
            Create: {route: "/users", method: "post"},
            Remove: {route: "/users/{id}", method: "delete"},
            Retrieve: {route: "/users/{id}", method: "get"},
            Update: {route: "/users/{id}", method: "put"},
            Avatar: {route: "/users/{id}/avatar", method: "patch"},
            GetShort: {route: "/users/short-by-query", method: "post"}
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
