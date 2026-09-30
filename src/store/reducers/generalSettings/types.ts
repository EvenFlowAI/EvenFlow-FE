export type TState = {
  settings: IGeneralSetting[];
  isLoading: boolean;
};

export enum ESettingType {
  DemandManagement = 'DemandManagement',
  DMS = 'DMS',
}

export interface IGeneralSettingData {
  isOn?: boolean;
  laborType?: string;
}

export interface IGeneralSetting {
  data: IGeneralSettingData;
  laborType: string;
  serviceCenterId: number;
  podId: number | null;
  settingType: ESettingType;
  id?: number;
}
