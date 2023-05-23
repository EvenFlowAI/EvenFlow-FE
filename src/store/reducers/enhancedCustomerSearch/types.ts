export interface ICustomerByName {
    customerId: number;
    lastName: string;
    firstName: string;
    cellPhone: string;
    homePhone: string;
    email: string;
    vehicleId: string;
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