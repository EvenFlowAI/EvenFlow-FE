import {ICreateAppointment, TApiResponse, ICreateAppointmentResp, IUpdateAppointment} from "./types";
import {request} from "../config/requests";

const appointment = {
    create: (data: ICreateAppointment): TApiResponse<ICreateAppointmentResp> => request.post("/appointments", data),
    update: (data: IUpdateAppointment): TApiResponse<ICreateAppointmentResp> => request.put(`/appointments/${data.id}`, data)
};
export const API = {
    appointment
};