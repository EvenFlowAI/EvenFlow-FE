export interface IDealershipGroup {
    name: string;
    serviceCenters: number;
    employees: number;
    mainAddress: string;
}

export interface IDealershipForm extends Partial<IDealershipGroup> {
    name: string;
    mainAddress: string;
    phone: string;
    email: string;
    // Contact info
    contactPersonName: string;
    contactPersonPhone: string;
    contactPersonEmail: string;
}

type AddDealership = {type: "Dealership/Add", payload: IDealershipGroup};
type Loading = {type: "Dealership/Loading", payload: boolean;};
type GetAllDealerships = {type: "Dealership/GetAll", payload: IDealershipGroup[]};

export type DealershipActions =
    | AddDealership
    | Loading
    | GetAllDealerships;

export type DealershipState = {
    dealershipList: IDealershipGroup[];
    loading: boolean;
}