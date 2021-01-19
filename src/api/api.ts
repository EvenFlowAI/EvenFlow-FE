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
    IListAppointment
} from "./types";
import {Api, request} from "../config/requests";
import {PaginatedAPIResponse} from "../types/types";
import {IAppointmentResponse, IAppointmentSlotsRequest, ISR} from "../store/reducers/appointment/types";

const accounts = {
    passwordRecovery: (data: IPasswordRecoveryData): TApiResponse<IPasswordRecoveryResp> => request.post("/accounts/password-recovery", data),
    setNewPassword: (data: ISetNewPasswordData): TApiResponse => request.patch("/accounts/password-reset", data)
}
const appointment = {
    create: (data: ICreateAppointment): TApiResponse<ICreateAppointmentResp> => request.post("/appointments", data),
    update: (data: IUpdateAppointment): TApiResponse<ICreateAppointmentResp> => request.put(`/appointments/${data.id}`, data),
    list: (data: IListAppointmentRequest): TApiResponse<PaginatedAPIResponse<IListAppointment>> => request.post("/appointments/by-query", data)
};
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
    accounts, appointment, employeeSchedules, configs, serviceRequests, timeSlots
};