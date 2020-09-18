import {IPageRequest, IPagingResponse} from "../../../types/types";

export interface IDealershipGroupShort {
    id: number;
    name: string;
    avatarPath: string;
}

export interface IAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface IDealershipProfile extends IDealershipGroupShort{
    address?: IAddress;
    phoneNumber: string;
}

export interface IDealershipGroupExtended extends IDealershipGroupShort {
    address: IAddress;
    countOfServiceCenters: number;
    countOfEmployees: number;
}

export interface IDealershipForm {
    name: string;
    phoneNumber: string;
    address: IAddress;
}
export interface IContactPersonForm {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
}

export interface IDealershipGroupForm {
    dealership: IDealershipForm;
    contactPerson: IContactPersonForm;
}
export interface IDealershipProfileForm {
    name: string;
    phoneNumber: string;
    address: IAddress;
}

type AddDealership = {type: "Dealership/Add", payload: IDealershipGroupExtended};
type Loading = {type: "Dealership/Loading", payload: boolean;};
type Saving = {type: "Dealership/Saving", payload: boolean;};
type GetAllDealerships = {type: "Dealership/GetAll", payload: IDealershipGroupExtended[]};
type ChangePageData = {type: "Dealership/ChangePageData", payload: Partial<IPageRequest>};
type ChangePaging = {type: "Dealership/ChangePaging", payload: IPagingResponse};
type Remove = {type: "Dealership/Remove", payload: number};
type Profile = {type: "Dealership/Profile", payload: IDealershipProfile};

export type DealershipActions =
    | AddDealership
    | Profile
    | Loading
    | Saving
    | Remove
    | GetAllDealerships
    | ChangePaging
    | ChangePageData;

export type DealershipState = {
    dealershipList: IDealershipGroupExtended[];
    profile?: IDealershipProfile;
    loading: boolean;
    saving: boolean;
    paging: IPagingResponse;
    pageData: IPageRequest
}