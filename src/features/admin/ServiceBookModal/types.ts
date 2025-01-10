import { IAdvisorShort } from "../../../store/reducers/users/types";
import { IBayShort } from "../../../store/reducers/bays/types";
import { IAssignedServiceRequestShort } from "../../../store/reducers/serviceRequests/types";

export type TOption = {
  value: number;
  name: string;
};

export type TForm = {
  name: string;
  description: string;
  advisors: IAdvisorShort[];
  technicians: IAdvisorShort[];
  bays: IBayShort[];
  serviceRequests: IAssignedServiceRequestShort[];
  isVisitCenter: boolean;
};
