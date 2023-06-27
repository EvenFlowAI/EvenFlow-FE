export type TEmailRequirement = {
    callCenterServiceAdvisorEnabled: boolean;
    customerSelfServiceEnabled: boolean;
}

export enum EScreenSettingsType {
    EmailRequirement
}
export interface IScreenSetting {
    type: EScreenSettingsType;
    value: number;
    serviceCenterId: number;
    podId?: number;
}

export const screenSettingsList: EScreenSettingsType[] = [
    EScreenSettingsType.EmailRequirement,
];

export type TOptContentData = {
    helperText: string;
    label: string;
    title: string;
    prefix?: string;
    suffix?: string;
}
export type TOptContent = {
    [k in EScreenSettingsType]: TOptContentData;
}