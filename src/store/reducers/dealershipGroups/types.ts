import {IPageRequest, IPagingResponse} from "../../../types/types";

export interface IDealershipGroupShort {
    id: number;
    name: string;
    mainAddress: string;
}

export interface IAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface IDealershipGroupExtended extends IDealershipGroupShort {
    address: IAddress;
    "countOfServiceCenters": number;
    "countOfEmployees": number;
    avatarPath: string;
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

type AddDealership = {type: "Dealership/Add", payload: IDealershipGroupExtended};
type Loading = {type: "Dealership/Loading", payload: boolean;};
type Saving = {type: "Dealership/Saving", payload: boolean;};
type GetAllDealerships = {type: "Dealership/GetAll", payload: IDealershipGroupExtended[]};
type ChangePageData = {type: "Dealership/ChangePageData", payload: Partial<IPageRequest>};
type ChangePaging = {type: "Dealership/ChangePaging", payload: IPagingResponse};

export type DealershipActions =
    | AddDealership
    | Loading
    | Saving
    | GetAllDealerships
    | ChangePaging
    | ChangePageData;

export type DealershipState = {
    dealershipList: IDealershipGroupExtended[];
    loading: boolean;
    saving: boolean;
    paging: IPagingResponse;
    pageData: IPageRequest
}