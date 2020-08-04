export interface IDealershipGroup {
    name: string;
    serviceCenters: number;
    employees: number;
    mainAddress: string;
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