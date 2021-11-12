import {IMake} from "../../../api/types";

export interface ICreateMake extends IMake {
   serviceCenterId: number;
   podId?:number;
}

export interface IMileage {
   id: number;
   value: number;
}

export type TCreateMileage = {
   values: number[];
   serviceCenterId: number;
   podId?: number;
}