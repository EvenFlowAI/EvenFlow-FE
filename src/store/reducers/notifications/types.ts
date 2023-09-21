import {IPod} from "../pods/types";

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
    pod: IPod|null;
    employeeIds: string[];
}