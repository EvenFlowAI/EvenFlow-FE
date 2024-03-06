export interface ICustomerConsent {
   id: number;
   name: string;
   isEnabled: boolean;
}

export interface TState {
    consentsList: ICustomerConsent[];
    isLoading: boolean;
}