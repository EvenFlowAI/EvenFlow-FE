import {ICreateAppointment, TApi, TApiResponse, TApiView, ICreateAppointmentResp} from "./types";
import axios from "axios";

const appointment: TApiView = {
    create: (data: ICreateAppointment): TApiResponse<ICreateAppointmentResp> => axios.post("/appointments", data),
};
export const API: TApi = {
    appointment
}