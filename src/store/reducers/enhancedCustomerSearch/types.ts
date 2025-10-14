import { IAddressData } from '../../../api/types';
import { IPageRequest, IPagingResponse, ParsableDate } from '../../../types/types';

export interface ICustomerByName {
  customerId: number;
  lastName: string;
  firstName: string;
  cellPhone: string;
  homePhone: string;
  email: string;
  vehicleId: string;
  vehicleDmsId: string;
  vehicleInternalId: number;
  address: IAddressData | null;
  appointmentAddress: IAddressData | null;
  make: string;
  model: string;
  vin: string;
  year: number;
  mileage?: number | null;
  appointmentHashKey?: string;
  customerHasOrders?: boolean;
}

export type TCustomerCommunication = {
  id: number;
  type: string;
  value: string;
};

export interface ICustomerWithPhones extends ICustomerByName {
  otherPhone: string;
  workPhone: string;
  communications: TCustomerCommunication[];
  hasOrders: boolean;
  transmission: string | null;
  driveType: string | null;
  engineTypeId: number | null;
  warrantyExpiration: ParsableDate | null;
  sortOrder?: number;
  companyName?: string;
  hasPlannedAppointment: boolean;
  isNameReadOnly: boolean;
}

export type ICustomerForTable = Omit<
  ICustomerWithPhones,
  'communications' | 'warrantyExpiration' | 'address' | 'appointmentAddress'
>;

export interface ICustomerVehicle {
  vehicleId: string;
  vehicleDmsId: string;
  vehicleInternalId: number | null;
  make: string;
  model: string;
  vin: string;
  year: number;
  appointmentHashKey?: string;
  hasPlannedAppointment?: boolean;
  mileage: number | null;
  hasOrders: boolean;
  transmission: string | null;
  driveType: string | null;
  engineTypeId: string | null;
  warrantyExpiration: ParsableDate | null;
  customerId?: string;
}

export interface ICustomerWithVehicles {
  customerId: number;
  lastName: string;
  firstName: string;
  cellPhone: string;
  homePhone: string;
  otherPhone: string;
  email: string;
  workPhone: string;
  communications: TCustomerCommunication[];
  vehicles: ICustomerVehicle[];
  address: IAddressData;
}

export interface IRepairOrderPart {
  id: string;
  description: string;
  qantity: number;
  price: number;
}

export interface IRepairOrderLabor {
  technicianDmsId: string;
  technicianName: string;
  title: string;
  description: string;
}

export interface IRepairOrderService {
  complaint: string;
  correction: string;
  cause: string;
  labors: IRepairOrderLabor[];
}

export interface IRepairOrder {
  id: number;
  dmsId: string;
  date: string;
  number: string;
  advisor: string;
  mileage: number;
  status: string;
  comments: string[];
  technicianLaborTime: number;
  totalPrice: number;
  warrantyPrice: number;
  customerPayPrice: number;
  miscPrice: number;
  services: IRepairOrderService[];
  parts: IRepairOrderPart[];
}

export interface IRepairHistory {
  customerId: number;
  lastName: string;
  firstName: string;
  cellPhone: string;
  homePhone: string;
  vehicleId: number;
  make: string;
  model: string;
  vin: string;
  year: number;
  repairOrders: IRepairOrder[];
  email?: string;
}

export type TSearchCustomerParams = {
  phoneOrEmail?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  address?: string;
  lastVINCharacters?: string;
};

export type TCustomerSearchData = {
  firstName: string;
  lastName: string;
  companyName: string;
  address: string;
  lastVINCharacters: string;
};

export type TCustomerSearchState = {
  isLoading: boolean;
  customers: ICustomerWithPhones[];
  currentCustomer: ICustomerWithPhones | null;
  paging: IPagingResponse;
  pageData: IPageRequest;
  repairHistory: IRepairHistory | null;
  repairHistoryPaging: IPagingResponse;
  repairHistoryLoading: boolean;
  customerSearchData: TCustomerSearchData;
};
