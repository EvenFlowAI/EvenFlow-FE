import {IMake, IMakeExtended} from "../../../api/types";

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
   name: string;
}

export type TCreateMileage = {
   values: number[];
   serviceCenterId: number;
   podId?: number;
}

export type TCreateEngineType = {
   names: string[];
   serviceCenterId: number;
   podId?: number;
}

export type TState = {
    makes: IMake[];
    currentMake: IMake | null;
    isLoading: boolean;
    mileage: IMileage[];
    makesModels: IMakeExtended[];
    engineTypes: IEngineType[];
}