export interface ICurrentUser {
    id: string;
    fullName: string;
    dealershipId: number;
    serviceCenterId: number;
    userName: string;
    email: string;
    role: string;
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
    role: string;
    serviceCenterId: number;
}


export type TGetCurrentUser = {type: "User/GetCurrentUser", payload: ICurrentUser};
type TSaving = {type: "User/Saving", payload: boolean};
export type TUserActions = TSaving | TGetCurrentUser;