export enum ENotificationType {
    ServiceCenter,
    Recalls
}

export type TSCNotifications = {
    isActive?: boolean;
    employees?: string[];
    notificationType?: ENotificationType;
}

export type TNotifications = {
    id?: number|null;
    usersList?: string[];
}

export type TTransportationNotifications = {
    isActive?: boolean;
    data: TNotifications[];
}