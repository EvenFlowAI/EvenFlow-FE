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
}


export type TGetCurrentUser = {type: "User/GetCurrentUser", payload: ICurrentUser};
export type TUserActions = TGetCurrentUser;