export interface ICustomerLifetime {
    from: number;
    to: number;
}
export interface ICustomerLifetimeForm extends ICustomerLifetime {
    serviceCenterId: number;
}