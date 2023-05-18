export interface ICustomerByName {
    customerId: number;
    lastName: string;
    firstName: string;
    cellPhone: string;
    homePhone: string;
    email: string;
    vehicleId: number;
    address: string;
    city: string;
    state: string;
    make: string;
    model: string;
    vin: string;
    year: number;
    appointmentHashKey?: string;
}

export interface IRepairOrderPart {
    number: string;
    description: string;
    quantity: number;
    price: number;
}

export interface IRepairOrderService {
    number: string;
    title: string;
    description: string;
    complaint: string;
    correction: string;
    cause: string;
}

export type TRepairPrice = {
    total: number;
    tax: number;
}

export interface IRepairOrder {
    date: string;
    number: string;
    advisor: string;
    mileage: number;
    status: string;
    comments: string[];
    technicianLaborTime: number;
    repairOrderPrice: TRepairPrice;
    warrantyPrice: TRepairPrice;
    customerPayPrice: TRepairPrice;
    miscPrice: TRepairPrice;
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