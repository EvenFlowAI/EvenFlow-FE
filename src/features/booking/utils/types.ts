import { TScreen } from '../../../types/screens';

export type TData = { [K in TScreen]: number };

export interface ICurrentMenu {
  yourLocation?: string;
  serviceNeeds: string;
  advisorSelection?: string;
  appointmentSelection: string;
  transportationNeeds?: string;
  appointmentConfirmation?: string;
  manageAppointment?: string;
}

export interface AppointmentSummaryI {
  appointmentHashKey: string;
  plannedDate: string;
}
