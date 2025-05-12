import { AxiosResponse } from 'axios';
import {
  EReminderType,
  IServiceRequestPrice,
  IVehicleData,
  IVehicleForSlots,
  IWaitListData,
  MPOptionShort,
  TRecallForRequest,
} from '../store/reducers/appointment/types';
import { EOfferType, IOffer } from '../store/reducers/offers/types';
import { IServiceRequest, IServiceRequestShort } from '../store/reducers/serviceRequests/types';
import { ICurrentUser } from '../store/reducers/users/types';
import { EServiceCategoryType, ICategory } from '../store/reducers/categories/types';
import { EJobType } from '../store/reducers/pods/types';
import { EPackagePricingType } from '../store/reducers/appointmentFrameReducer/types';
import { IFirstScreenOption } from '../store/reducers/serviceTypes/types';
import { TPackagePrice } from '../store/reducers/packages/types';
import { TScheduler, TServiceBook } from '../store/reducers/appointments/types';
import { TEnumKeyLabel } from '../store/reducers/types';
import { ParsableDate, TParsableDate } from '../types/types';
import { EPricingDisplayType } from '../store/reducers/pricingSettings/types';

export type TApiResponse<R = any> = Promise<AxiosResponse<R>>;

export type TServiceRequestAssigned = {
  type: number;
  serviceRequestId: number;
  description?: string;
  code?: string;
};

export enum EServiceCategoryPage {
  Page1,
  Page2,
}

export enum EServiceCenterName {
  RiverviewFord,
  BMWSchererville,
  DealertrackTest,
  SanfordInfiniti,
  Dominion,
  Fremont,
  LakePowellFord,
  LexusCincinnati,
  LexusRiverCenter,
  DealerBuilt,
  Bountiful,
}

export enum ECustomerCriteria {
  Any,
  Own,
  Lease,
}

export enum EMaintenanceOptionType {
  Base,
  Value,
  Preferred,
}

export interface ICreateAppointmentResp extends IAppointmentByQuery {
  id: number;
  hashKey: string;
  transactionValue: number;
}

export interface ICustomerLoadedData {
  emails: string[];
  firstName?: string;
  lastName?: string;
  fullName?: string;
  id: string;
  sessionId?: string;
  phoneNumbers: string[];
  vehicles: ILoadedVehicle[];
  fromSearchByName?: boolean;
  isUpdating?: boolean;
  address?: IAddressData | null;
  companyName?: string;
}

export interface IVehicle {
  vin: string;
  make: string;
  model: string;
  year: number | null;
  mileage: number | null;
  serviceInterval?: string;
  modelDetails?: string;
  engineTypeId?: number | null;
}

export interface ILoadedVehicle extends IVehicle {
  id?: number | string;
  dmsId?: string;
  warrantyExpiration?: ParsableDate;
  appointmentHashKeys: string[];
  hasRepairOrders?: boolean;
  hasOrders?: boolean;
  vehicleDmsId?: string;
}

export interface IVehicleForRequest extends IVehicle {
  dmsId?: string;
  appointmentHashKeys?: string[];
  hasRepairOrders?: boolean;
  warrantyExpiration?: ParsableDate;
}

export interface IPasswordRecoveryData {
  email: string;
}

export interface IPasswordRecoveryResp {}

export interface ISetNewPasswordData {
  userId: string;
  token: string;
  newPassword: string;
}

export interface IConfig {
  roles: string[];
  timeZones: string[];
}

export interface IListAppointmentRequest {
  serviceCenterId: number;
  offerId?: number;
  pageIndex: number;
  pageSize?: number;
  date?: ParsableDate;
  orderBy?: string;
  isAscending?: boolean;
  searchTerm?: string;
  reportingStatus?: EReportingStatus | null | unknown;
}

export interface IDriverInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  companyName?: string;
  city?: string;
  id?: number;
}

export enum AppointmentStatus {
  Active,
  Cancelled,
}

export const appointmentStatuses: TEnumKeyLabel<AppointmentStatus> = {
  [AppointmentStatus.Active]: 'Active',
  [AppointmentStatus.Cancelled]: 'Canceled',
};

export interface IBaseAppointment {
  id: number;
  hashKey: string;
  appointmentStatus: AppointmentStatus;
  requestDate: TParsableDate;
  dateInUtc: TParsableDate;
  remindAtInUtc: TParsableDate;
  timeSlot: string;
  vehicleId: number;
  vehicle: IVehicleData;
  customerId: string;
  maintenancePackageOptionId: number | null;
  maintenancePackageOption: IPackageOptions | null;
  driver: IDriverInfo;
  duration: number;
  transactionValue: number;
  serviceCenterId: number;
  transportationOption: ITransportation | null;
  isNeedCall: boolean;
  offerId: number;
  offer: IOffer;
  isEditable: boolean;
  reminderTypes: EReminderType[];
  serviceRequests: IServiceRequestShort[];
  createdBy: string;
  user?: ICurrentUser;
  serviceTypeOption?: IFirstScreenOption | null;
  ancillaryPrice: number;
}

export interface IListAppointment extends IBaseAppointment {
  serviceCategory: ICategory | null;
}

export type TServiceValetSlot = {
  pickUpMin: string;
  pickUpMax: string;
  dropOffMin?: string;
  dropOffMax?: string;
};

export interface IAddressData {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  fullAddress?: string;
  originalFullAddress?: string;
}

// export type TAppointmentAdvisor = {
//   isAnySelected: boolean;
//   id?: string | null;
// };

export interface IAppointmentByKey extends IBaseAppointment {
  serviceCategories: ICategory[];
  jobType?: EJobType;
  serviceTypeOption?: IFirstScreenOption;
  recalls?: string[];
  recallDescriptions?: string[];
  advisorId: string | null;
  detailedPriceList?: IServiceRequestPrice[];
  serviceValetTime?: TServiceValetSlot;
  notes?: string;
  address?: IAddressData;
  isWaitlist?: boolean;
  waitlistTextSettings?: Partial<IWaitListData>;
  podId?: number;
  recallsModel?: TRecallForRequest[]
}

export interface IAppointmentByQuery extends IBaseAppointment {
  serviceCategories: ICategory[];
  jobType?: EJobType;
  serviceTypeOption?: IFirstScreenOption;
  recalls?: string[];
  recallDescriptions?: string[];
  consultant?: Partial<IServiceConsultant> | null;
  detailedPriceList?: IServiceRequestPrice[];
  serviceValetTime?: TServiceValetSlot;
  notes?: string;
  address?: IAddressData;
}

export interface IAppointmentCustomerInfo {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  dmsId?: string;
  companyName?: string;
}

export interface IAppointmentVehicle {
  vin: string;
  make: string;
  model: string;
  year: number;
  dmsId?: string;
  mileage?: string;
}

export type TDateAppointmentData = {
  date: TParsableDate;
  scheduler: TScheduler;
};

export type TServiceRequested = {
  code?: string;
  description?: string;
  pricingDisplayType?: EPricingDisplayType;
};

export type TDetailedPrice = {
  requestName: string;
  pricingDisplayType: EPricingDisplayType;
  priceValue?: number;
};

export interface IAppointment {
  id: number;
  hashKey: string;
  address?: IAddressData;
  advisor?: string;
  ancillaryPrice: number;
  appointmentNumber: string;
  appointmentStatus: AppointmentStatus;
  createdDateTime: TParsableDate;
  customerInformation?: IAppointmentCustomerInfo;
  dateTime: TParsableDate;
  detailedPriceList?: TDetailedPrice[];
  estimatedMileage?: string;
  isDefaultRecall: boolean;
  isEditable: boolean;
  modificationInfo: TDateAppointmentData[];
  notes?: string;
  reportingStatus: EReportingStatus;
  scheduler: TScheduler;
  serviceBook: TServiceBook;
  serviceOption?: string;
  servicesRequested: TServiceRequested[];
  technician?: string;
  totalValue: number;
  transportation?: string;
  vehicle?: IAppointmentVehicle;
}

export interface IServiceCategoryShort {
  id: number;
  name: string;
}

export interface IOfferForCategory {
  id: number;
  type: EOfferType;
  expiringDate: string;
  description: string;
  title: string;
  valueOff?: number;
}

export interface IServiceCategory extends IServiceCategoryShort {
  page: EServiceCategoryPage;
  serviceRequests: IServiceRequest[];
  type: EServiceCategoryType;
  price: number;
  loadedIcon?: JSX.Element | string;
  iconPath?: string;
  description?: string;
  offer?: IOfferForCategory;
  isCommentRequired?: boolean;
  comment: string;
}

export interface IServiceConsultant {
  id: string;
  name: string;
  dmsId: string;
  dmsName: string;
  position: string;
  iconPath: string;
}

export interface IServiceRequestIds {
  id: number;
  comment: string | null;
}

export interface IConsultantsRequestData {
  serviceCenterId: number;
  pageIndex: 0;
  pageSize: 0;
  searchTerm: string;
  serviceRequests: IServiceRequestIds[];
  serviceCategories: IServiceRequestIds[] | number[];
  maintenancePackageOption: MPOptionShort | null;
  recalls: TRecallForRequest[];
  serviceTypeOptionId: number | null;
  vehicle: IVehicleForSlots;
  valueServiceOfferIds?: number[];
  address?: string;
  zipCode?: string;
  appointmentHashKey?: string;
}

export interface ICustomer {
  fullName: string;
  phoneNumber: string;
  email: string;
  city?: string;
  id?: number;
  companyName?: string;
}

export interface ITransportation {
  id: number;
  type: number;
  name: string;
  description: string;
  iconPath?: string;
}

export interface IYearRange {
  from: number;
  to: number;
}

export interface IBusinessRule {
  vehicleMakes: string[];
  vehicleModels: string[];
  vehicleYearRange: IYearRange;
  vehicleMileageValues: string[];
  customerCriteria: ECustomerCriteria;
  engineTypeIds: number[];
}

export interface IComplimentaryService {
  id: number;
  name: string;
  price: number;
  durationInHours: number;
  orderIndex: number;
}

export type TServiceRequestShort = {
  id: number;
  code: string;
  description: string;
  durationInHours: number;
  price: number;
  orderIndex: number;
};

export type TExtendedComplimentary = {
  laborAmount: number;
  partsAmount: number;
  detailedDescription?: string;
} & IComplimentaryService;

export type TExtendedService = {
  laborAmount: number;
  partsAmount: number;
  detailedDescription?: string;
} & TServiceRequestShort;

export type TUpsellOfOption = {
  id: number;
  name: string;
  detailedDescription: string;
  orderIndex: number;
};

export interface IPackageOptions {
  id: number;
  type: EMaintenanceOptionType;
  name: string;
  price: number;
  serviceRequests: TExtendedService[];
  complimentaryServices: TExtendedComplimentary[];
  marketPriceServiceRequests: number;
  marketPriceComplimentaryServices: number;
  marketPriceIntervalUpsells: number;
  intervalUpsells: TUpsellOfOption[];
  totalMaintenanceValue: number;
  marketPriceIntervalUpsell: number;
  maintenancePackageName: string;
  priceType?: EPackagePricingType;
}

export interface IPackage {
  isApplyPricingOptimization?: boolean;
  maintenancePackageName?: string;
  options: IPackageOptions[];
  priceTitles: TPackagePrice[];
  segmentTitles: TSegmentTitle[];
}

export interface IPackageAppointments extends IPackage {
  isApplyPricingOptimization: boolean;
  maintenancePackageName: string;
}

export interface IPackageServiceRequestsAssigned {
  type: EMaintenanceOptionType;
  serviceRequestId: number;
  description: string;
  code: string;
}

export interface IPackageByQuery {
  name: string;
  id: number;
  isApplyPricingOptimization: boolean;
  serviceRequests: TExtendedService[];
  complimentaryServices: TExtendedComplimentary[];
  serviceRequestsAssigned: IPackageServiceRequestsAssigned[];
  priceTitle?: string;
  priceWithFeeTitle?: string;
  isShowSuggestedPrice?: boolean;
  isManualOverridePrice?: boolean;
  intervalUpsells: TIntervalUpsellForPackage[];
}

export type TModelCode = {
  id: number;
  code: string;
  name: string;
};

export interface IModel {
  globalId: number;
  isReadOnly: boolean;
  orderIndex: number;
  id: number;
  name: string;
}

export interface IMake {
  name: string;
  models: IModel[];
  id: number;
  globalId: number;
  isReadOnly: boolean;
  orderIndex: number;
}

export interface IModel {
  name: string;
  id: number;
}
export interface IMakeExtended {
  name: string;
  models: IModel[];
  id: number;
}

export type TEngineType = {
  id: number;
  name: string;
};

export type TIntervalUpsellForPackage = {
  id: number;
  code: string;
  description: string;
  durationInHours: number;
  invoiceAmount: number;
  orderIndex: number;
  partsUnitCost: number;
  numberOfParts: number;
};

export enum ESegmentTitle {
  IntervalUpsell,
  Complimentary,
}

export type TSegmentTitle = {
  title: string;
  type: ESegmentTitle;
};

export interface IPackageById {
  isApplyPricingOptimization: boolean;
  isApplyBusinessRules: boolean;
  options: IPackageOptionDetailed[];
  serviceRequestsAssigned: TServiceRequestAssigned[];
  name: string;
  id: number;
  serviceRequests: TExtendedService[];
  complimentaryServices: TExtendedComplimentary[];
  intervalUpsells: TIntervalUpsellForPackage[];
  businessRules: IBusinessRule;
  engineTypes: TEngineType[];
  isShowSuggestedPrice?: boolean;
  isManualOverridePrice?: boolean;
  priceTitles: TPackagePrice[];
  segmentTitles: TSegmentTitle[];
}

export type TOptionServiceRequest = {
  isSendToDMS: boolean;
  serviceRequestId: number;
};

export interface IPackageOptionDetailed {
  id: number;
  type: EMaintenanceOptionType;
  price: number;
  serviceRequests: TOptionServiceRequest[];
  intervalUpsells: TOptionServiceRequest[];
  complimentaryServices: number[];
  complimentaryServiceLaborHours: number;
  complimentaryServicePrice: number;
  maintenancePackageId: number;
  serviceRequestLaborHours: number;
  serviceRequestPrice: number;
  intervalUpsellServiceLaborHours: number;
  intervalUpsellServicePrice: number;
  name?: string;
  serviceRequestAssignedId?: number;
}
export enum EReportingStatus {
  Active,
  Rescheduled,
  Cancelled,
  Showed,
  WalkInWithAppointment,
  NoShowed,
  WaitlistActive,
  WaitlistRescheduled,
  WaitlistCancelled,
  WaitlistShowed,
  WaitlistWalkInWithAppointment,
  WaitlistNoShowed,
}

export const reportingStatuses: TEnumKeyLabel<EReportingStatus> = {
  [EReportingStatus.Active]: 'Active',
  [EReportingStatus.Rescheduled]: 'Rescheduled',
  [EReportingStatus.Cancelled]: 'Canceled',
  [EReportingStatus.Showed]: 'Showed',
  [EReportingStatus.WalkInWithAppointment]: 'Walk In With Appointment',
  [EReportingStatus.NoShowed]: 'No Showed',
  [EReportingStatus.WaitlistActive]: 'Waitlist Active',
  [EReportingStatus.WaitlistRescheduled]: 'Waitlist Rescheduled',
  [EReportingStatus.WaitlistCancelled]: 'Waitlist Canceled',
  [EReportingStatus.WaitlistShowed]: 'Waitlist Showed',
  [EReportingStatus.WaitlistWalkInWithAppointment]: 'Waitlist Walk In With Appointment',
  [EReportingStatus.WaitlistNoShowed]: 'Waitlist No Showed',
};
