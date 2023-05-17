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