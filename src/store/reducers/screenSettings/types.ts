export type TEmailRequirement = {
    adminAndEmployeesEnabled: boolean;
    customerSelfServiceEnabled: boolean;
}

export enum EScreenSettingsType {
    EmailRequirement
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
export type TState = {
    emailRequirement: TEmailRequirement | null;
    isEmailRequirementLoading: boolean;
}