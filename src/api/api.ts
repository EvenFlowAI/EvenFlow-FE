import {ICreateAppointment, TApiResponse, ICreateAppointmentResp} from "./types";
import {request} from "../config/requests";

const appointment = {
    create: (data: ICreateAppointment): TApiResponse<ICreateAppointmentResp> => request.post("/appointments", data),
};
export const API = {
    appointment
};