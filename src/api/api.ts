import {
    ICreateAppointment,
    TApiResponse,
    ICreateAppointmentResp,
    IUpdateAppointment,
    IPasswordRecoveryData, IPasswordRecoveryResp
} from "./types";
import {request} from "../config/requests";

const accounts = {
    passwordRecovery: (data: IPasswordRecoveryData): TApiResponse<IPasswordRecoveryResp> => request.post("/accounts/password-recovery", data),
}
const appointment = {
    create: (data: ICreateAppointment): TApiResponse<ICreateAppointmentResp> => request.post("/appointments", data),
    update: (data: IUpdateAppointment): TApiResponse<ICreateAppointmentResp> => request.put(`/appointments/${data.id}`, data)
};
export const API = {
    accounts, appointment
};