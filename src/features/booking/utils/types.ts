import { TScreen } from '../../../types/types';

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
