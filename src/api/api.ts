import {
  TApiResponse,
  IPasswordRecoveryData,
  IPasswordRecoveryResp,
  ISetNewPasswordData,
  IConfig,
  IListAppointmentRequest,
  IAppointment,
  IAppointmentByKey,
} from './types';
import { request } from './request';
import { PaginatedAPIResponse } from '../types/types';
import { ITokens } from '../types/auth';

const accounts = {
  passwordRecovery: (data: IPasswordRecoveryData): TApiResponse<IPasswordRecoveryResp> =>
    request.post('/accounts/password-recovery', data),
  setNewPassword: (data: ISetNewPasswordData): TApiResponse =>
    request.patch('/accounts/password-reset', data),
};

const appointment = {
  list: (data: IListAppointmentRequest): TApiResponse<PaginatedAPIResponse<IAppointment>> =>
    request.post('/appointments/by-query', data),
  cancelByKey: (key: string): TApiResponse => request.put(`/appointments/${key}/cancel/by-key`),
  cancel: (id: number): TApiResponse => request.put(`/appointments/${id}/cancel`),
  getByKey: (key: string): TApiResponse<IAppointmentByKey> =>
    request.get(`/appointments/${key}/by-key`),
  getFromEmail: (key: string): TApiResponse<IAppointmentByKey> =>
    request.get(`/appointments/${key}`),
  cancelFromEmail: (key: string): TApiResponse<IAppointmentByKey> =>
    request.get(`/appointments/${key}`),
};

const authentication = {
  dealership: (dealershipId: number): TApiResponse<ITokens> =>
    request.post('/authentications/dealership', { dealershipId }),
};

const employeeSchedules = {
  remove: (id: number): TApiResponse<{}> => request.delete(`/employee-schedules/${id}`),
};

const configs = {
  get: (): TApiResponse<IConfig> => request.get('/configs'),
};

export const API = {
  accounts,
  appointment,
  authentication,
  configs,
  employeeSchedules,
};
