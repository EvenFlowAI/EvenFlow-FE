import {IMake} from "../../../api/types";

export interface ICreateMake extends IMake {
   serviceCenterId: number;
   podId?:number;
}

export interface IMileage {
   id: number;
   value: number;
}

export interface IEngineType {
   id: number;
   value: string;
}

export type TCreateMileage = {
   values: number[];
   serviceCenterId: number;
   podId?: number;
}

export type TCreateEngineType = {
   values: string[];
   serviceCenterId: number;
   podId?: number;
}