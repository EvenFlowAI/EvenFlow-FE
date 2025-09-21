import {
  EDisplayOnBookingType,
  EEmployeeType,
} from '../../../components/modals/admin/CreateEmployee/types';

export interface ICurrentUser {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  dealershipId: number;
  serviceCenterId: number;
  userName: string;
  email: string;
  role: TRole;
  adminDealership?: boolean;
  phoneNumber: string;
  emailConfirmed: boolean;
  avatarPath: string;
  isSuperUser: boolean;
  dmsId?: string;
}
export interface IUserForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: TRole;
  displayOnBookingTypes?: EDisplayOnBookingType[];
  type?: EEmployeeType;
  serviceCenterId?: number;
  dmsId?: string | null;
  dis?: boolean;
  position?: string;
}
export interface IAdvisorShort {
  id: string;
  role: TRole;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarPath: string;
  email?: string;
}

export type TGetCurrentUser = { type: 'User/GetCurrentUser'; payload: ICurrentUser };
type TSaving = { type: 'User/Saving'; payload: boolean };
type TLoading = { type: 'User/Loading'; payload: boolean };
export type TUserActions = TSaving | TGetCurrentUser | TLoading;
export type TRole =
  | 'EvenFlow Admin' 
  | 'EvenFlow Account Manager' 
  | 'EvenFlow Support'
  | 'EvenFlow Agentic AI Configuration Agent'  
  | 'Dealer Owner'
  | 'Service Director'
  | 'Service Manager'
  | 'BDC Manager'
  | 'BDC Agent'
  | 'Advisor'
  | 'Technician'
  | 'Staff'
  | 'Vendor'
  | 'AI Booking Agent';

export type IUsersState = {
  currentUser?: ICurrentUser;
  saving: boolean;
  loading: boolean;
  isSuperAdmin: boolean;
};
