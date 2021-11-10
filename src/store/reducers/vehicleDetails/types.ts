import {IMake} from "../../../api/types";

export interface ICreateMake extends IMake {
   serviceCenterId: number;
   podId?:number;
}