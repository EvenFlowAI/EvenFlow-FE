import axios, {AxiosResponse} from "axios";
import {APIUrl} from "./config";
import {ICredentials, IRefreshTokenData, ITokens, LocalTokens} from "../types/types";
import {pathReplace} from "../utils/utils";
import {API} from "../api/api";


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

    setDealershipTokens({accessToken, refreshToken}: ITokens) {
        const tokens: ITokens = {
            accessToken: this.getLocalToken(),
            refreshToken: this.getRefreshToken()
        };
        localStorage.setItem(LocalTokens.suToken, JSON.stringify(tokens));
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

    async dealershipLogin(dealershipId: number) {
        try {
            const {data: tokens} = await API.authentication.dealership(dealershipId);
            this.setDealershipTokens(tokens);
            this.refreshRequest();
        } catch (e) {
            console.error(e);
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
        const suTokens = localStorage.getItem(LocalTokens.suToken);
        if (suTokens) {
            localStorage.removeItem(LocalTokens.suToken);
            this.setTokens(JSON.parse(suTokens) as ITokens);
        }
        this.refreshRequest();
    }
}

export const authService = new AuthService();
export const request = axios.create({
    baseURL: APIUrl,
    headers: {Authorization: `Bearer ${authService.getLocalToken()}`}
});
export const endUserRequest = axios.create({
    baseURL: APIUrl
});

request.interceptors.request.use(request => {
    const sessionId = localStorage.getItem(LocalTokens.sessionId);
    if (sessionId?.length) request.headers['SessionId'] = sessionId;
    return request;
})

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
    Appointments: Record<"Create" | "Update" | "UpdateByKey" | "Cancel" | "CancelByKey", TApiRoute>,
    AppointmentAllocation: Record<"SetTimeWindows" | "GetTimeWindows"
        | "CreateDemandSegment" | "GetDemandSegments"
        | "GetTWEligibility" | "SetTWEligibility"
        | "BatchUpdateDemandSegments" | "RemoveDemandSegment"
        | "SetUnplanned" | "GetUnplanned", TApiRoute>,
    AppointmentSlots: Record<"GetSlots", TApiRoute>,
    Authentications: Record<"Request" | "Refresh", TApiRoute>,
    Bays: Record<"Create" | "Update" | "Remove" | "Retrieve" | "GetAll" | "GetShort", TApiRoute>,
    ComplimentaryServices: Record<"GetByQuery" | "Remove" | "Update" | "AddFromList" | "Create", TApiRoute>,
    Dealerships: Record<"Create" | "GetShort" | "Retrieve" | "Remove" | "Update" | "GetAll"
        | "UpdateAddress" | "UploadAvatar", TApiRoute>,
    Employees: Record<"Create" | "Update" | "GetAll", TApiRoute>,
    EmployeeSchedule: Record<"Create" | "Update" | "GetAll" | "Retrieve" | "Remove", TApiRoute>,
    Holidays: Record<"Create" | "Update" | "Remove" | "Retrieve" | "GetAll", TApiRoute>,
    MaintenancePackages: Record<"Create" | "Update" | "Remove" | "Retrieve" | "SetPricingOptimization"
        | "GetByQuery" | "PackageOptions" | "ByVehicle", TApiRoute>,
    OptimizationWindows: Record<"GetParams" | "SetParams" | "GetOverbooking" | "SetOverbooking"
        | "GetAppointmentCutoff" | "SetAppointmentCutoff", TApiRoute>,
    Offers: Record<"Create" | "GetAll" | "Retrieve" | "Edit" | "ChangeStatus" | "Remove", TApiRoute>,
    Pods: Record<"Create" | "Update" | "Retrieve" | "GetAll" | "Remove" | "GetShort", TApiRoute>,
    PricingSettings: Record<"GetList" | "Edit" | "GetDayOfWeek" | "SetDayOfWeek"
        | "CreateTimeOfYear" | "GetTimeOfYear" | "UpdateTimeOfYear" | "RemoveTimeOfYear"
        | "GetLevels" | "SetLevels" | "Calculation", TApiRoute>,
    ServiceCategories: Record<"Create" | "UpdateIcon" | "Update" | "Remove" | "Retrieve"
        | "GetByQuery" | "GetByPage", TApiRoute>
    ServiceCenters: Record<"Create" | "GetShort" | "Update" | "Remove" | "Retrieve" | "UpdateAddress"
        | "GetAll" | "Avatar" | "GetSelection" | "GetHOO" | "SetHOO" | "GetWS" | "SetWS" | "WorkingDays"
        | "GetBreaks" | "SetBreaks" | "Analytics" | "ChangePricingOpt", TApiRoute>,
    ServiceConsultants: Record<"Create" | "Update" | "Remove" | "Retrieve"
        | "GetByQuery" | "GetDmsAdvisors", TApiRoute>,
    ServiceRequests: Record<"Create" | "Remove" | "Update" | "Retrieve" | "GetFiltered"
        | "UpdateStatus" | "CreateOverrides" | "EditOverrides" | "GetSROverrides"
        | "GetAssignedOverrides" | "AssignMultiple" | "RemoveOverride" | "GetShort"
        | "Eligibility"
        | "EditSkills" | "Prioritize", TApiRoute>,
    SlotScoring: Record<"SetProximity" | "GetProximity" | "SetDesirability" | "GetDesirability"
        | "SetOptimization" | "GetOptimization" | "SetValues", TApiRoute>,
    TransportationOptions: Record<"Edit" | "Get" | "GetActive" | "Rules", TApiRoute>,
    Users: Record<"GetAll" | "Create" | "Update" | "Remove" | "Retrieve" | "Avatar" | "GetShort", TApiRoute>,
    ValueSettings: Record<"GetValue" | "SetValue" | "GetCL" | "SetCL" | "GetCTS" | "SetCTS"
        | "GetWS" | "SetWS", TApiRoute>,
    Vehicles: Record<"GetByVIN" | "GetByQuery" | "Models" | "Makes", TApiRoute>,
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
        Appointments: {
            Create: {route: "/appointments", method: "post"},
            Update: {route: "/appointments/{id}", method: "put"},
            UpdateByKey: {route: "/appointments/{id}/by-key", method: "put"},
            Cancel: {route: "/appointments/{id}/cancel", method: "put"},
            CancelByKey: {route: "/appointments/{id}/cancel/by-key", method: "put"}
        },
        AppointmentAllocation: {
            SetTimeWindows: {route: "/appointment-allocations/time-windows", method: "put"},
            GetTimeWindows: {route: "/appointment-allocations/time-windows", method: "get"},
            GetTWEligibility: {route: "/appointment-allocations/time-windows/eligibility", method: "get"},
            SetTWEligibility: {route: "/appointment-allocations/time-windows/eligibility", method: "patch"},
            CreateDemandSegment: {route: "/appointment-allocations/demand-segments", method: "post"},
            GetDemandSegments: {route: "/appointment-allocations/demand-segments", method: "get"},
            BatchUpdateDemandSegments: {route: "/appointment-allocations/demand-segments", method: "put"},
            RemoveDemandSegment: {route: "/appointment-allocations/demand-segments/{id}", method: "delete"},
            SetUnplanned: {route: "/appointment-allocations/unplanned-demand-segments", method: "put"},
            GetUnplanned: {route: "/appointment-allocations/unplanned-demand-segments", method: "get"},
        },
        AppointmentSlots: {
            GetSlots: {route: "/appointment-slots/by-query", method: "post"}
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
        ComplimentaryServices: {
            GetByQuery: {route: "/complimentary-services/by-query", method: "post"},
            Create: {route: "/complimentary-services", method: "post"},
            AddFromList: {route: "/complimentary-services/add-service-request", method: "post"},
            Update: {route: "/complimentary-services/{id}", method: "put"},
            Remove: {route: "/complimentary-services/{id}", method: "delete"},
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
        MaintenancePackages: {
            Create: {route: "/maintenance-packages", method: "post"},
            Update: {route: "/maintenance-packages/{id}", method: "put"},
            Remove: {route: "/maintenance-packages/{id}", method: "delete"},
            Retrieve: {route: "/maintenance-packages/{id}", method: "get"},
            SetPricingOptimization: {route: "/maintenance-packages/{id}/pricing-optimization", method: "patch"},
            GetByQuery: {route: "/maintenance-packages/by-query", method: "post"},
            PackageOptions: {route: "/maintenance-packages/{id}/options", method: "put"},
            ByVehicle: {route: "/maintenance-packages/by-vehicle", method: "post"},
        },
        OptimizationWindows: {
            GetParams: {route: "/optimization-windows", method: "get"},
            SetParams: {route: "/optimization-windows", method: "put"},
            GetOverbooking: {route: "/optimization-windows/overbooking-factor", method: "get"},
            SetOverbooking: {route: "/optimization-windows/overbooking-factor", method: "put"},
            GetAppointmentCutoff: {route: "/optimization-windows/appointment-cutoff", method: "get"},
            SetAppointmentCutoff: {route: "/optimization-windows/appointment-cutoff", method: "put"},
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
        PricingSettings: {
            GetList: {route: "/pricing-settings", method: "get"},
            Edit: {route: "/pricing-settings", method: "put"},
            GetDayOfWeek: {route: "/pricing-settings/day-of-week", method: "get"},
            SetDayOfWeek: {route: "/pricing-settings/day-of-week", method: "put"},
            CreateTimeOfYear: {route: "/pricing-settings/time-of-year", method: "post"},
            GetTimeOfYear: {route: "/pricing-settings/time-of-year", method: "get"},
            UpdateTimeOfYear: {route: "/pricing-settings/time-of-year/{id}", method: "put"},
            RemoveTimeOfYear: {route: "/pricing-settings/time-of-year/{id}", method: "delete"},
            GetLevels: {route: "/pricing-settings/levels", method: "get"},
            SetLevels: {route: "/pricing-settings/levels", method: "put"},
            Calculation: {route: "/pricing-settings/calculation", method: "get"},
        },
        ServiceCategories: {
            Create: {route: "/service-categories", method: "post"},
            UpdateIcon: {route: "/service-categories/{id}/icon", method: "patch"},
            Update: {route: "/service-categories/{id}", method: "put"},
            Remove: {route: "/service-categories/{id}", method: "delete"},
            Retrieve: {route: "/service-categories/{id}", method: "get"},
            GetByQuery: {route: "/service-categories/by-query", method: "post"},
            GetByPage: {route: "/service-categories/by-page", method: "post"},
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
            ChangePricingOpt: {route: "/service-centers/{id}/pricing-optimization", method: "patch"},
            GetSelection: {route: "/service-centers/selection", method: "get"},
            GetHOO: {route: "/service-centers/{id}/hours-of-operations", method: "get"},
            SetHOO: {route: "/service-centers/{id}/hours-of-operations", method: "put"},
            GetWS: {route: "/service-centers/{id}/weekly-schedules", method: "get"},
            SetWS: {route: "/service-centers/{id}/weekly-schedules", method: "put"},
            GetBreaks: {route: "/service-centers/{id}/breaks", method: "get"},
            SetBreaks: {route: "/service-centers/{id}/breaks", method: "put"},
            WorkingDays: {route: "/service-centers/{id}/working-days", method: "get"},
            Analytics: {route: "/service-centers/{id}/analytics", method: "get"}
        },
        ServiceConsultants: {
            Create: {route: "/service-consultants", method: "post"},
            Update: {route: "/service-consultants/{id}", method: "put"},
            Remove: {route: "/service-consultants/{id}", method: "delete"},
            Retrieve: {route: "/service-consultants/{id}", method: "get"},
            GetByQuery: {route: "/service-consultants/by-query", method: "post"},
            GetDmsAdvisors: {route: "/service-consultants/{id}/dms-service-advisors", method: "get"},
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
            Eligibility: {route: "/service-requests/eligibility", method: "patch"},
            Prioritize: {route: "/service-requests/prioritize", method: "patch"},
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
        TransportationOptions: {
            Edit: {route: "/transportation-options", method: "put"},
            Get: {route: "/transportation-options", method: "get"},
            GetActive: {route: "/transportation-options/active/by-query", method: "post"},
            Rules: {route: "/transportation-options/{id}/rules", method: "put"},
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
        },
        Vehicles: {
            GetByVIN: {route: "/vehicles/by-vin", method: "get"},
            GetByQuery: {route: "/vehicles/by-query", method: "post"},
            Models: {route: "/vehicles/models", method: "get"},
            Makes: {route: "/vehicles/makes", method: "get"}
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
