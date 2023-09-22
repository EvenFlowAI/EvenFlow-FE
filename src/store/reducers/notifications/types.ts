export type TEmployee = {
    id: string;
    name: string;
    email: string;
}

export type TSCNotifications = {
    isActive: boolean;
    employeeIds: string[];
}

export type TPodNotifications = {
    podId: number|null;
    employeeIds: string[];
}