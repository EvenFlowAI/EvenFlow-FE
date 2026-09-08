import { IAddress, IDealershipGroupShort } from '../dealershipGroups/types';
import { IOrder, IPageRequest, IPagingResponse } from '../../../types/types';
import { EMaintenanceOptionType, PackageSourceType } from '../../../api/types';
import { TEmailRequirement } from '../screenSettings/types';
import { TChangePageDataGeneric, TChangePagingGeneric } from '../types';
import { EDay } from '../demandSegments/types';
import { EAdvisorAssignMethod, IEmployeeAssignmentSetting } from '../employees/types';

export enum SystemType {
  Tekion = 'tekion',
  Xtime = 'xtime',
}

export enum SystemIntegrationType {
  Fortellis = 1,
  Motive = 2,
  DealerTrack = 4,
  Reynolds = 8,
  CDK = 16,
  DealerBuilt = 32,
  Dominion = 64,
}

export interface IServiceCenter {
  id: number;
  name: string;
  address: IAddress;
  applyPricingOptimization: boolean;
  mainAddress: string;
  avatarPath?: string;
  timeZoneId: string;
  laborRatePerHour: number;
  isAuthRequired: boolean;
  serviceCenterFlag?: number;
  isUpdateAdvisorInAppointments?: boolean;
  maintenancePackageDisclaimer?: string;
  isShowPriceDetails?: boolean;
  recallServiceRequestId?: number;
  defaultVehicleMakeId?: number | null;
  maintenancePackageOptionTypes: EMaintenanceOptionType[];
  engineTypeFieldName?: string;
  emailRequirement?: TEmailRequirement;
  packageSource: PackageSourceType;
  system?: SystemType;
  integration?: number;
}
export interface IServiceCenterExtended extends IServiceCenter {
  countOfManagers: number;
  countOfTechnician: number;
  countOfEmployees: number;
  dealership: IDealershipGroupShort;
  serviceCenterEmail: string;
  contactPersonalEmail: string;
  phoneNumber: string;
  dealershipId: number;
}
export interface IServiceCenterForm {
  id?: number;
  avatarPath?: string;
  name: string;
  serviceCenterEmail: string;
  contactPersonalEmail: string;
  phoneNumber: string;
  address: IAddress;
  timeZoneId: string;
}

export interface IHOODataForm {
  dayOfWeek: number;
  from: string;
  to: string;
}

export interface IBreak {
  id?: number;
  dayOfWeek: number;
  from: string;
  to: string;
}

export interface IBreakFrom {
  breaks: IBreak[];
}

export interface ISCAnalytics {
  countOfTechnicians: number;
  countOfPods: number;
  countOfAppointmentsToday: number;
}

export type TGetAll = { type: 'ServiceCenters/GetAll'; payload: IServiceCenterExtended[] };
export type TGetDealershipAll = {
  type: 'ServiceCenters/GetDealershipAll';
  payload: IServiceCenterExtended[];
};
export type TGetShort = { type: 'ServiceCenters/GetShort'; payload: IServiceCenter[] };
export type TShortLoading = { type: 'ServiceCenters/ShortLoading'; payload: boolean };
export type TCreate = { type: 'ServiceCenters/Create'; payload: IServiceCenterExtended };
export type TLoading = { type: 'ServiceCenters/Loading'; payload: boolean };
export type TDealershipLoading = { type: 'ServiceCenters/DealershipLoading'; payload: boolean };
export type TSaving = { type: 'ServiceCenters/Saving'; payload: boolean };
export type TSelectSC = { type: 'ServiceCenters/SelectSC'; payload: IServiceCenter | undefined };
export type TFullSCList = { type: 'ServiceCenters/FullSCList'; payload: IServiceCenter[] };
export type TChangePageData = TChangePageDataGeneric<'ServiceCenters/ChangePageData'>;
export type TChangePaging = TChangePagingGeneric<'ServiceCenters/ChangePaging'>;
export type TChangeDealershipPaging = TChangePagingGeneric<'ServiceCenters/ChangeDealershipPaging'>;
export type TSetDealerShipId = {
  type: 'ServiceCenters/SetDealershipId';
  payload: number | undefined;
};
export type TSetReminders = { type: 'ServiceCenters/SetReminders'; payload: boolean };
export type TSetRemindersLoading = { type: 'ServiceCenters/SetRemindersLoading'; payload: boolean };
export type TSetPredictionParams = {
  type: 'ServiceCenters/SetPredictionParams';
  payload: IPredictionParams;
};
export type TSetLaborRate = { type: 'ServiceCenters/SetLaborRate'; payload: ILaborRate };
export type TSetPredictionParamsLoading = {
  type: 'ServiceCenters/SetParamsLoading';
  payload: boolean;
};
export type TSetPackageOptionsLoading = {
  type: 'ServiceCenters/PackageOptionsLoading';
  payload: boolean;
};
export type TAdvisorAssignment = {
  type: 'ServiceCenters/GetAdvisorAssignment';
  payload: IEmployeeAssignmentSetting[];
};
export type TAdvisorAssignmentLoading = {
  type: 'ServiceCenters/SetAdvisorAssignmentLoading';
  payload: boolean;
};

export type TServiceCenterActions =
  | TCreate
  | TLoading
  | TSelectSC
  | TFullSCList
  | TSaving
  | TDealershipLoading
  | TGetDealershipAll
  | TChangeDealershipPaging
  | TChangePageData
  | TChangePaging
  | TGetShort
  | TShortLoading
  | TSetDealerShipId
  | TGetAll
  | TSetReminders
  | TSetRemindersLoading
  | TSetPredictionParams
  | TSetLaborRate
  | TSetPredictionParamsLoading
  | TSetPackageOptionsLoading
  | TAdvisorAssignment
  | TAdvisorAssignmentLoading;

export interface IPredictionParams {
  heavyRepairLaborHours: number;
  otherRepairLaborHours: number;
  defaultLaborHours: number;
  pickUpDropOffHours: number;
  podId?: number;
}

export interface ILaborRate {
  customerPay: number;
  warranty: number;
  internal: number;
}

export interface IAdvisorAssignment {
  primaryMethod?: EAdvisorAssignMethod | null;
  secondaryMethod?: EAdvisorAssignMethod | null;
}

export type TServiceCenterState = {
  serviceCenters: IServiceCenterExtended[];
  dealershipSCs: IServiceCenterExtended[];
  fullSCList: IServiceCenter[];
  selectedSC?: IServiceCenter;
  shortSC: IServiceCenter[];
  loading: boolean;
  packagesOptionsLoading: boolean;
  dealershipLoading: boolean;
  shortLoading: boolean;
  saving: boolean;
  paging: IPagingResponse;
  dealershipPaging: IPagingResponse;
  pageData: IPageRequest;
  order: IOrder<IServiceCenterExtended>;
  searchTerm: string;
  workingDays: EDay[];
  analytics: ISCAnalytics;
  dealershipId: number | undefined;
  reminders: boolean;
  remindersLoading: boolean;
  predictionParams: IPredictionParams;
  laborRate: ILaborRate;
  predictionParamsLoading: boolean;
  employeeAssignment: IEmployeeAssignmentSetting[];
  advisorAssignmentLoading: boolean;
};
