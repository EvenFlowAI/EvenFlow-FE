export interface ICustomerVehicle {
    id: number;
    vin: string;
    make: string;
    model: string;
    year: number|null;
    appointmentHashKeys: string[];
}

export interface ICustomerByName {
    id: string;
    lastName: string;
    firstName: string;
    cellPhone: string;
    homePhone?: string;
    state?: string;
    city?: string;
    address?: string;
    email?: string;
}

export interface ICustomerWithVehicles extends ICustomerByName{
    vehicles: ICustomerVehicle[];
}

export interface IRemappedCustomer extends ICustomerByName {
    vehicle: ICustomerVehicle;
}
