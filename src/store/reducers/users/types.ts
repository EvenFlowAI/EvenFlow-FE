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
}
export interface IUserForm {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: TRole;
    serviceCenterId: number;
}
export interface IAdvisorShort {
    id: string;
    role: TRole;
    firstName: string;
    lastName: string;
    fullName: string;
    avatarPath: string;
}


export type TGetCurrentUser = {type: "User/GetCurrentUser", payload: ICurrentUser};
type TSaving = {type: "User/Saving", payload: boolean};
export type TUserActions = TSaving | TGetCurrentUser;
export type TRole =
    | "Super Admin"
    | "Owner"
    | "Manager"
    | "Advisor"
    | "Technician"
    | "Call Center Rep"