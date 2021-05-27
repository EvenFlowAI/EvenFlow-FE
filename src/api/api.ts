import {
    ICreateAppointment,
    TApiResponse,
    ICreateAppointmentResp,
    IUpdateAppointment,
    IPasswordRecoveryData,
    IPasswordRecoveryResp,
    ISetNewPasswordData,
    IConfig,
    IListAppointmentRequest,
    IListAppointment, ISearchCustomerParams, ISearchTerm, ISecurityCode, ISessionId, IServiceCenterId
} from "./types";
import {Api, endUserRequest, request} from "../config/requests";
import {ITokens, PaginatedAPIResponse} from "../types/types";
import {IAppointmentResponse, IAppointmentSlotsRequest, ISR} from "../store/reducers/appointment/types";

const accounts = {
    passwordRecovery: (data: IPasswordRecoveryData): TApiResponse<IPasswordRecoveryResp> => request.post("/accounts/password-recovery", data),
    setNewPassword: (data: ISetNewPasswordData): TApiResponse => request.patch("/accounts/password-reset", data)
}
const appointment = {
    create: (data: ICreateAppointment): TApiResponse<ICreateAppointmentResp> => request.post("/appointments", data),
    update: (data: ICreateAppointment): TApiResponse<ICreateAppointmentResp> => request.put(`/appointments/${data.id}`, data),
    updateByKey: (data: IUpdateAppointment): TApiResponse<ICreateAppointmentResp> => request.put(
      `/appointments/${data.hashKey}/by-key`, data
    ),
    list: (data: IListAppointmentRequest): TApiResponse<PaginatedAPIResponse<IListAppointment>> => request.post("/appointments/by-query", data),
    customerList:
        (headers: ISessionId, params: IServiceCenterId):
            TApiResponse<IListAppointment[]> =>
            endUserRequest.get("/appointments", {headers, params}),
    searchCustomer: (params: ISearchCustomerParams): TApiResponse => request.get("/customers", {params}),
    searchCustomerByKey: (headers: ISessionId, params: ISearchCustomerParams): TApiResponse => endUserRequest.get("/customers/by-session", {params, headers}),
    sendConfirmation: (data: ISearchTerm): TApiResponse<string> => request.post("/sessions/open", data),
    confirm: (headers: ISessionId,  data: ISecurityCode): TApiResponse => endUserRequest.post(
        '/sessions/activate', data, {headers}),
    cancelByKey: (key: string): TApiResponse => request.put(`/appointments/${key}/cancel/by-key`),
    cancel: (id: number): TApiResponse => request.put(`/appointments/${id}/cancel`),
    getByKey: (key: string): TApiResponse<IListAppointment> => request.get(`/appointments/${key}/by-key`)
};
const authentication = {
    dealership: (dealershipId: number): TApiResponse<ITokens> =>
        request.post("/authentications/dealership", { dealershipId })
}
const employeeSchedules = {
    remove: (id: number): TApiResponse<{}> => request.delete(`/employee-schedules/${id}`),
}
const configs = {
    get: (): TApiResponse<IConfig> => request.get("/configs")
}
const timeSlots = {
    list: (data: IAppointmentSlotsRequest): TApiResponse<IAppointmentResponse> => request.post(
        Api.endpoints.AppointmentSlots.GetSlots.route,
        data
    )
};
const serviceRequests = {
    list: (id: number, searchTerm: string): TApiResponse<PaginatedAPIResponse<ISR>> => request.get(
        "/service-requests/overrides/short-by-query",
        {
            params: {
                serviceCenterId: id,
                searchTerm,
                pageSize: 0,
                pageIndex: 0
            }
        }
    )
}
export const API = {
    accounts,
    appointment,
    authentication,
    configs,
    employeeSchedules,
    serviceRequests,
    timeSlots
};