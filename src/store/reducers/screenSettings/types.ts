export type TEmailRequirement = {
    adminAndEmployeesEnabled: boolean;
    customerSelfServiceEnabled: boolean;
}

export enum EScreenSettingsType {
    EmailRequirement, CustomerConsent
}

export const screenSettingsList: EScreenSettingsType[] = [
    EScreenSettingsType.EmailRequirement,
    EScreenSettingsType.CustomerConsent,
];

export type TOptContentData = {
    helperText: string;
    label: string;
    title: string;
    isLoading: boolean;
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