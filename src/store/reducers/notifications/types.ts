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
    id: number;
    usersList?: string[];
}

export type TTransportationNotifications = {
    isActive?: boolean;
    transportationOptions: TNotifications[];
}

export type TState = {
    isLoading: boolean;
    scNotifications: TSCNotifications | null;
    podNotifications: TNotifications[];
    transportationNotifications: TTransportationNotifications | null;
    recallNotifications: TSCNotifications | null;
}