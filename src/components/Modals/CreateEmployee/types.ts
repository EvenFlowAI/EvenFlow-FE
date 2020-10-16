import {IServiceCenter} from "../../../store/reducers/serviceCenters/types";
import {TTechnicianLevel} from "../../../types/types";
import React from "react";
import {Value} from "@material-ui/lab";

export type TAdvisorForm = {
    firstName: string;
    email: string;
    phoneNumber: string;
    lastName: string;
    serviceCenter: IServiceCenter | null;
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