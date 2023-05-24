export type TView = "select" | "search" | "confirm" | "serviceSelect";

export interface IEnhancedCustomerData {
    id: number;
    lastName: string;
    firstName: string;
    cell: string;
    address: string;
    city: string;
    phoneNumber: string;
    email: string;
    state: string;
    year: number;
    make: string;
    model: string;
    vin: string;
}
