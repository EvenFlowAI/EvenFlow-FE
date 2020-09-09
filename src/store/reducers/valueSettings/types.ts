export interface ICustomerLifetime {
    from: number;
    to: number;
}
export interface ICustomerLifetimeForm extends ICustomerLifetime {
    serviceCenterId: number;
}
export enum NewLostEnum {
    New,
    Lost
}
export interface INewLostCustomer {
    serviceCenterId: number;
    periodInMonth: number;
    type: NewLostEnum
}
export interface IEndOfWarranty {
    serviceCenterId: number;
    periodInMonth: number;
}