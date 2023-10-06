export type TEmployee = {
    id: string;
    name: string;
    email: string;
}

export enum ENotificationType {
    ServiceCenter,
    Recalls
}

export type TSCNotifications = {
    isActive?: boolean;
    employees?: string[];
    notificationType?: ENotificationType;
}

export type TPodNotifications = {
    podId?: number|null;
    usersList?: string[];
}

export type TTransportationNotifications = {
    transportationId?: number|null;
    usersList?: string[];
}