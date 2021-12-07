import {IServiceCenter} from "../../../store/reducers/serviceCenters/types";
import {TTechnicianLevel} from "../../../types/types";
import React from "react";
import {Value} from "@material-ui/lab";
import {TRole} from "../../../store/reducers/users/types";
import {TConsultantOption} from "./Forms";

export type TAdvisorForm = {
    firstName: string;
    email: string;
    role: TRole;
    phoneNumber: string;
    lastName: string;
    serviceCenter: IServiceCenter | null;
    dmsId: number | string | null;
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
}
export type TSelectChange = (e: React.ChangeEvent<{}>, value: Value<IServiceCenter, false, any, any>) => void;
export type TDMSConsultantChange = (e: React.ChangeEvent<{}>, value: TConsultantOption | null) => void;