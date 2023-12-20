import {TOptContentData} from "../../../store/reducers/optimizationWindows/types";

export enum ECenterSettingType {
    ShowDropOffTime, DmsAppointmentTime, ServiceValetOpsCode
}

export type TOptContent = {
    [k in ECenterSettingType]: TOptContentData;
}

export const centerSettingsList: ECenterSettingType[] = [
    ECenterSettingType.ShowDropOffTime,
    ECenterSettingType.DmsAppointmentTime,
    ECenterSettingType.ServiceValetOpsCode
]