import { IAddress } from '../dealershipGroups/types';
import { EDemandCategory, EPricingDisplayType } from '../pricingSettings/types';
import { EOfferType, IOffer } from '../offers/types';
import {
  EMaintenanceOptionType,
  ICreateAppointmentResp,
  ICustomerLoadedData,
  IOfferForCategory,
  IModel,
  IServiceCategory,
  IServiceCategoryShort,
  IServiceRequestIds,
} from '../../../api/types';
import { EPackagePricingType } from '../appointmentFrameReducer/types';
import { TEmailRequirement } from '../screenSettings/types';
import { ParsableDate, TParsableDate } from '../../../types/types';

export interface IServiceCenterProfile {
  id: number;
  name: string;
  serviceCenterEmail: string;
  contactPersonalEmail: string;
  phoneNumber: string;
  avatarPath: string;
  address: IAddress;
  dealershipId: number;
  dealershipName: string;
  serviceCenterFlag: number;
  isRoundPrice: boolean;
  isAuthRequired: boolean;
  isSendReminders?: boolean;
  maintenancePackageDisclaimer?: string;
  isShowPriceDetails?: boolean;
  defaultVehicleMakeId?: number | null;
  isCommentRequired: boolean;
  engineTypeFieldName?: string;
  dmsId?: string;
  maintenancePackageOptionTypes: EMaintenanceOptionType[];
  eMenuEnabled?: boolean;
  emailRequirement?: TEmailRequirement;
}

export interface ISR {
  id: number;
  code: string;
  description?: string;
  price?: number;
  comment?: string;
}

export interface IVehicleData {
  vin: string;
  make: string;
  year: number;
  model: string;
  mileage: number;
  engineTypeId?: number;
  makeId?: number;
  dmsId?: string;
}

export interface IVehicleShort {
  vin: string;
  make: string;
  year: number;
  model: string;
  mileage: number | null;
}

export interface IVehicle extends IVehicleShort {
  transmission: string;
  driveType: string;
  engineTypeId: number | null;
}

export interface IPersonalInformation {
  fullName: string;
  phoneNumber: string;
  email: string;
}

export interface IReminders {
  email: boolean;
  phone: boolean;
  sms: boolean;
}
export interface IPrivacy {
  privacy: boolean;
  callback: boolean;
}
export interface IPrice {
  value: number;
  category: EDemandCategory;
  amountOfSavingMoney?: number;
  ancillaryPrice: number;
}

export interface IWaitListData {
  isEnabled?: boolean;
  text: string;
  textHex?: string;
  boxHex?: string;
  rolloverText?: string;
}

export interface IAppointmentSlot {
  date: ParsableDate;
  time: string;
  price: IPrice;
  priceWithOffer?: IPrice;
  offer?: IOffer;
  isShorterWaitTime: boolean;
  isOverbookingApplied?: boolean;
  searchDate?: TParsableDate;
}

export interface ISearchedDateRange {
  from: TParsableDate;
  to: TParsableDate;
}

export interface IAppointmentResponse {
  items: IAppointmentSlot[];
  searchedDateRange: ISearchedDateRange;
  slotGapMinutes: number;
  advisorId?: string;
  waitlistSettings?: IWaitListData;
  podId?: number;
}

export enum EAppointmentTimingType {
  SpecialOffers,
  PreferredDate,
  FirstAvailable,
}

export interface IVehicleForSlots {
  vin: string;
  make: string;
  year: number | null;
  model: string;
  mileage: number | null;
  engineTypeId?: number | null;
}

export type TRecallForRequest = {
  serviceRequestId: number;
  number: string | undefined;
  id?: number;
  recallComponent: string;
};

export type MPOptionShort = {
  id?: number;
  priceType?: EPackagePricingType | null;
  optionType?: EMaintenanceOptionType | null;
};

export interface IAppointmentSlotsRequest {
  serviceCenterId: number;
  maintenancePackageOptionId?: number | null;
  maintenancePackageOption: MPOptionShort | null;
  fromDate?: ParsableDate;
  appointmentTimingType: EAppointmentTimingType;
  countOfDays?: number;
  offerType?: EOfferType;
  serviceCategories: IServiceRequestIds[];
  onlyOffers?: boolean;
  shorterWaitTime?: boolean;
  serviceRequests: IServiceRequestIds[];
  customerId?: string;
  warrantyExpiration?: ParsableDate;
  advisorId?: string | null;
  valueServiceOfferIds?: number[];
  vehicle?: IVehicleForSlots;
  searchTerm?: string;
  appointmentHashKey?: string;
  jobType?: number | null;
  serviceTypeOptionId: number | null;
  zipCode?: string;
  address?: string;
  recalls: TRecallForRequest[];
  transportationOptionId: number | null;
}

export interface IRemappedAppointmentSlot extends IAppointmentSlot {
  id: string;
  date: TParsableDate;
  serviceRequestPrices?: IServiceRequestPrice[];
  timingType?: number;
  appointmentDate?: string;
}

export interface IAppointmentFilters {
  offersOnly: boolean;
  waitTimeOnly: boolean;
}

export type TAppointmentState = {
  sessionId: string;
  updated: boolean;
  customerEnteredEmail: string;
  scProfile?: IServiceCenterProfile;
  serviceRequests: ISR[];
  customerLoadedData: ICustomerLoadedData | null;
  appointmentId: ICreateAppointmentResp | null;
  selectedSR: number[];
  selectedSRComments: Record<number, string>;
  search: string;
  personalInformation: IPersonalInformation;
  reminders: IReminders;
  privacy: IPrivacy;
  appointment: IRemappedAppointmentSlot | null;
  serviceValetAppointment: IServiceValetAppointment | null;
  searchedDateRange: ISearchedDateRange | null;
  appointmentSlots: IRemappedAppointmentSlot[];
  serviceValetSlots: IServiceValetAppointment[];
  appointmentFilters: IAppointmentFilters;
  serviceCategories: IServiceCategory[];
  allServiceCategories: IServiceCategoryShort[];
  isProfileLoading: boolean;
  dropOffSettings: IDropOffSettings | null;
  appointmentWasChanged: boolean;
  waitListSettings: IWaitListData | null;
  slotPodId: number | null;
  isAppointmentSlotsLoading: boolean;
  isTopAligning: boolean;
  slotsServiceTypeOptionId: number | null;
  slotsTransportationId: number | null;
  slotsSearchedDate: ParsableDate;
};

export enum EReminderType {
  Email,
  Phone,
  Sms,
}

export const APPOINTMENT_STATE_KEY = 'APPOINTMENT';
export const APPOINTMENT_STATE_SAVED_KEY = 'APPOINTMENT_SAVED';


export interface IServiceRequestPrice {
  requestName: string;
  pricingDisplayType: EPricingDisplayType;
  priceValue?: number;
  offer?: IOfferForCategory;
}

export interface IServiceValetRequestPrice {
  requestName: string;
  priceValue: number;
  pricingDisplayType: EPricingDisplayType;
  serviceCategoryId: number;
}

export interface IAppointmentPriceItem {
  serviceRequestId: number;
  price: number;
}

export interface IServiceValetAppointmentPrice {
  priceWithoutOptimization: number;
  value: number;
  amountOfSavingMoney: number;
  ancillaryPrice: number;
  category: string;
  items: IAppointmentPriceItem[];
}

export interface IServiceValetAppointment {
  date: TParsableDate;
  pickUpMin: string;
  pickUpMax: string;
  dropOffDescription: string;
  available: number;
  price: IServiceValetAppointmentPrice;
  serviceRequestPrices: IServiceValetRequestPrice[];
  dropOffMin?: string;
  dropOffMax?: string;
  searchDate?: TParsableDate;
}

export interface IDropOffSettings {
  showDropOffTime: boolean;
  description: string;
}

export interface ISVAppointmentResponse {
  items: IServiceValetAppointment[];
  searchedDateRange: ISearchedDateRange;
  dropOffSettings: IDropOffSettings;
}
