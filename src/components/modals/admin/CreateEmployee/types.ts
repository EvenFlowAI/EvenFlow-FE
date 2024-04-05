import {IServiceCenter} from "../../../../store/reducers/serviceCenters/types";
import {TTechnicianLevel} from "../../../../types/types";
import React from "react";
import {TRole} from "../../../../store/reducers/users/types";
import {TServiceConsultant} from "../../../../store/reducers/appointments/types";

export type TConsultantOption = {
    id: string;
    name: string;
}

export type TEmployeeForm = {
    firstName: string;
    email: string;
    role: TRole|null;
    lastName: string;
    serviceCenter?: IServiceCenter | null;
    dmsId?: string | null;
    position: string;
    showOnBooking?: boolean;
    hourlyRate?: number | '';
    overtimeRate?: number | '';
    technicianLevel?: TTechnicianLevel;
}

export type TAdvisorForm = {
    firstName: string;
    email: string;
    role: TRole;
    phoneNumber: string;
    lastName: string;
    serviceCenter: IServiceCenter | null;
    dmsId: string | null;
    position: string;
    showOnBooking: boolean;
}

export type TTechnicianForm = {
    firstName: string;
    lastName: string;
    serviceCenter: IServiceCenter | null;
    hourlyRate: number | '';
    overtimeRate: number | '';
    email?: string;
    phoneNumber?: string;
    technicianLevel: TTechnicianLevel;
    dmsId: string | null;
}

export type TSelectChange = (e: React.ChangeEvent<{}>, value: IServiceCenter|null) => void;

export type TDMSConsultantChange = (e: React.ChangeEvent<{}>, value: TServiceConsultant | null) => void;
