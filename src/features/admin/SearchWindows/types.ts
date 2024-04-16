import {TOptContentData} from "../../../store/reducers/optimizationWindows/types";

export enum ESearchWindowType {
    FirstAvailable, SpecificDate
}

export type TWindowContent = {
    [k in ESearchWindowType]: TOptContentData;
}