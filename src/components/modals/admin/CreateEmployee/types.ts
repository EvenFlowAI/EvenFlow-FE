import { IServiceCenter } from '../../../../store/reducers/serviceCenters/types';
import { TTechnicianLevel } from '../../../../types/types';
import React from 'react';
import { TRole } from '../../../../store/reducers/users/types';
import { TServiceConsultant } from '../../../../store/reducers/appointments/types';
export enum EDisplayOnBookingType {
  SelfService,
  Employee,
}

export enum EEmployeeType {
  Individual,
  Team,
}

export type TEmployeeForm = {
  firstName: string;
  email: string;
  role: TRole | null;
  lastName: string;
  serviceCenter?: IServiceCenter | null;
  dmsId?: string | null;
  position: string;
  displayOnBookingTypes?: EDisplayOnBookingType[];
  type?: EEmployeeType | null;
  hourlyRate?: number | '';
  overtimeRate?: number | '';
  technicianLevel?: TTechnicianLevel;
};

export type TSelectChange = (e: React.ChangeEvent<{}>, value: IServiceCenter | null) => void;

export type TDMSConsultantChange = (
  e: React.ChangeEvent<{}>,
  value: TServiceConsultant | null
) => void;
