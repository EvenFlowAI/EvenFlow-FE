import { IPageRequest, IPagingResponse } from '../../../types/types';

export interface IDealershipGroupShort {
  id: number;
  name: string;
  avatarPath: string;
  logoPath: string;
  leftPanelColor?: string;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface IDealershipProfile extends IDealershipGroupShort {
  address?: IAddress;
  phoneNumber: string;
}

export interface IDealershipGroupExtended extends IDealershipGroupShort {
  address: IAddress;
  countOfServiceCenters: number;
  countOfEmployees: number;
  phoneNumber: string;
}

export interface IDealershipForm {
  name: string;
  dealershipPhoneNumber: string;
}
export interface IContactPersonForm {
  firstName: string;
  lastName: string;
  personPhoneNumber: string;
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
  leftPanelColor?: string;
}

type AddDealership = { type: 'Dealership/Add'; payload: IDealershipGroupExtended };
type Loading = { type: 'Dealership/Loading'; payload: boolean };
type Saving = { type: 'Dealership/Saving'; payload: boolean };
type GetAllDealerships = { type: 'Dealership/GetAll'; payload: IDealershipGroupExtended[] };
type ChangePageData = { type: 'Dealership/ChangePageData'; payload: Partial<IPageRequest> };
type ChangePaging = { type: 'Dealership/ChangePaging'; payload: IPagingResponse };
type Remove = { type: 'Dealership/Remove'; payload: number };
type Profile = { type: 'Dealership/Profile'; payload: IDealershipProfile };
type SetSearchTerm = { type: 'Dealership/SetSearchTerm'; payload: string };
type SetSidebarColorHex = { type: 'Dealership/SetSidebarColorHex'; payload: string | undefined };
type SetCustomLogoPath = { type: 'Dealership/SetCustomLogoPath'; payload: string | undefined };

export type DealershipActions =
  | AddDealership
  | Profile
  | Loading
  | Saving
  | Remove
  | GetAllDealerships
  | ChangePaging
  | ChangePageData
  | SetSearchTerm
  | SetSidebarColorHex
  | SetCustomLogoPath;

export type DealershipState = {
  dealershipList: IDealershipGroupExtended[];
  profile?: IDealershipProfile;
  loading: boolean;
  saving: boolean;
  paging: IPagingResponse;
  pageData: IPageRequest;
  searchTerm: string;
  sidebarColorHex?: string; // 6-char hex without '#'
  customLogoPath?: string;
};
