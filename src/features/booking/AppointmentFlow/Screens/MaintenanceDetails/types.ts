import {TMaintenanceDetails} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {ILoadedVehicle} from "../../../../../api/types";

export type TKey = keyof TMaintenanceDetails | keyof ILoadedVehicle;
export type TOptionsState = { [s: string]: string[] };