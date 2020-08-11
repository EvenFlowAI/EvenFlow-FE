export interface IDealershipGroup {
    name: string;
    serviceCenters: number;
    employees: number;
    mainAddress: string;
}

export interface IDealershipForm {
    name: string;
    mainAddress: string;
    phoneNumber: string;
}
export interface IContactPersonForm {
    fullName: string;
    phoneNumber: string;
    email: string;
}

export interface IDealershipGroupForm {
    dealership: IDealershipForm;
    contactPerson: IContactPersonForm;
}

type AddDealership = {type: "Dealership/Add", payload: IDealershipGroup};
type Loading = {type: "Dealership/Loading", payload: boolean;};
type Saving = {type: "Dealership/Saving", payload: boolean;};
type GetAllDealerships = {type: "Dealership/GetAll", payload: IDealershipGroup[]};

export type DealershipActions =
    | AddDealership
    | Loading
    | Saving
    | GetAllDealerships;

export type DealershipState = {
    dealershipList: IDealershipGroup[];
    loading: boolean;
    saving: boolean;
}