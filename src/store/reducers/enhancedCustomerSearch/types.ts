import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

export interface ICustomerByName {
    customerId: number;
    customerInternalId: number;
    lastName: string;
    firstName: string;
    cellPhone: string;
    homePhone: string;
    email: string;
    vehicleId: string;
    vehicleDmsId: string;
    vehicleInternalId: number;
    address: string;
    city: string;
    state: string;
    make: string;
    model: string;
    vin: string;
    year: number;
    mileage?: number|null;
    appointmentHashKey?: string;
    customerHasOrders?: boolean;
}

export type TCustomerCommunication = {
    id: number,
    type: string,
    value: string
}

export interface ICustomerWithPhones extends ICustomerByName {
    otherPhone: string;
    workPhone: string;
    communications: TCustomerCommunication[];
    hasOrders: boolean;
    transmission: string|null;
    driveType:  string|null;
    engineTypeId: number|null;
    warrantyExpiration: ParsableDate|null;
}

export interface ICustomerVehicle {
    vehicleId: string;
    vehicleDmsId: string;
    vehicleInternalId: number|null;
    make: string;
    model: string;
    vin: string;
    year: number;
    appointmentHashKey?: string;
    mileage: number|null;
    hasOrders: boolean;
    transmission: string|null;
    driveType: string|null;
    engineTypeId: string|null;
    warrantyExpiration: ParsableDate|null;
}

export interface ICustomerWithVehicles {
    customerId: number;
    customerInternalId: number;
    lastName: string;
    firstName: string;
    cellPhone: string;
    homePhone: string;
    email: string;
    workPhone: string;
    city: string;
    state: string;
    address: string;
    communications: TCustomerCommunication[];
    vehicles: ICustomerVehicle[];
}

export interface IRepairOrderPart {
    id: string;
    description: string;
    qantity: number;
    price: number;
}

export interface IRepairOrderLabor {
    technicianId: string;
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
    warrantyPrice:number;
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
}

export type TCustomerSearchData = {
    firstName: string;
    lastName: string;
}