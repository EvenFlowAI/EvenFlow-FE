import {IAdvisorShort} from "../../../store/reducers/users/types";
import {IBayShort} from "../../../store/reducers/bays/types";
import {IAssignedServiceRequestShort} from "../../../store/reducers/serviceRequests/types";

export type TOption = {
    value: number;
    name: string;
}

export type TForm = {
    name: string;
    description: string;
    advisor: IAdvisorShort | null;
    technicians: IAdvisorShort[];
    bays: IBayShort[];
    serviceRequests: IAssignedServiceRequestShort[];
    isVisitCenter: boolean;
}