export type TState = {
  settings: IGeneralSetting[];
  isLoading: boolean;
};

export enum ESettingType {
  DemandManagement = "DemandManagement",
  CompanyName = "CompanyName",
}

export interface IGeneralSettingData {
  isOn?: boolean;
}

export interface IGeneralSetting {
  data: IGeneralSettingData;
  serviceCenterId: number;
  podId: number | null;
  settingType: ESettingType;
  id?: number;
}
