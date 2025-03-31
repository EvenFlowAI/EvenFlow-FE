import {
  EMaintenanceOptionType,
  IAddressData,
  IAppointmentByKey,
  ICustomer,
  ILoadedVehicle,
  IMake,
  IPackage,
  IPackageOptions,
  IServiceCategory,
  IServiceConsultant,
  ITransportation,
  IServiceRequestIds,
} from '../../../api/types';
import {
  EAppointmentTimingType,
  EReminderType,
  IServiceRequestPrice,
  TRecallForRequest,
} from '../appointment/types';
import { IRecallByVin, ParsableDate, TParsableDate, TScreen, TView } from '../../../types/types';
import { IHOODataForm } from '../serviceCenters/types';
import { IFirstScreenOption } from '../serviceTypes/types';
import { TPackagePrice } from '../packages/types';
import { EScheduler } from '../appointments/types';

export interface IAppointmentId {
  id: number;
  hashKey: string;
}

export interface IMaintenanceDetailsShort {
  year?: string;
  make?: string;
  model?: string;
  serviceInterval?: string;
  mileage?: string;
}

export interface TMaintenanceDetails extends IMaintenanceDetailsShort {
  trim?: string;
  powertrain?: string;
  oilType?: string;
  engineTypeId?: number | null;
  vin?: string;
}

export enum EUserType {
  New,
  Existing,
}

export enum EServiceType {
  VisitCenter,
  MobileService,
  PickUpDropOff,
  General,
}

export type TModel = {
  id: number;
  name: string;
};

export type TSeries = {
  name: string;
  models: TModel[];
  id: number;
};

export type TYear = {
  year: number;
  series: TSeries[];
};
export interface IValueService {
  year: TYear | null;
  model: TModel | null;
  series: TSeries | undefined;
  selectedService: IServiceOffer | null;
}

export interface IServiceOffer {
  id: number;
  name: string;
  price: number;
  imagePath: string;
  description: string;
}

export type TLanguage = 'en' | 'es';

export interface IAncillaryByZipRequest {
  address: string;
  zipCode: string;
  serviceCenterId: number;
  serviceTypeOptionId: number | null;
}

export enum EAncillaryType {
  Amount,
  Percent,
}

export type TAncillaryPriceByZip = {
  feeAmount: number | null;
  feeType: EAncillaryType;
};

export enum EPackagePricingType {
  BasePrice,
  PriceWithFee,
}

export type TEditingPosition =
  | 'address'
  | 'serviceOption'
  | 'slot'
  | 'serviceRequests'
  | 'advisor'
  | 'transportation';

export type TFiltersVisibility = {
  transportations: boolean;
  serviceType: boolean;
  advisor: boolean;
};

export type TServiceCategory = {
  id: number;
  comment: string;
};

export type TState = {
  service: IServiceCategory | null;
  subService: IServiceCategory | null;
  selectedPackage: IPackageOptions | null;
  advisor: IServiceConsultant | null;
  isAnyAdvisorSelected: boolean;
  selectedTiming: EAppointmentTimingType | null;
  selectedTime: TParsableDate;
  selectedVehicle: ILoadedVehicle | null;
  customer: ICustomer;
  reminders: EReminderType[];
  transportation: ITransportation | null;
  transportations: ITransportation[];
  isTransportationsLoading: boolean;
  maintenanceDetails: TMaintenanceDetails;
  packages: IPackage[];
  isPackagesLoading: boolean;
  consultants: IServiceConsultant[];
  isConsultantsLoading: boolean;
  currentScreen: TScreen | '';
  prevScreen: TScreen | '';
  makes: IMake[];
  models: string[];
  trackerData: TTrackerState;
  isAdditionalServices: boolean;
  packageIsSelected: boolean;
  packageOptionType: number | null;
  serviceCategories: TServiceCategory[];
  id?: number;
  hashKey?: string;
  gap: number | undefined;
  userType: EUserType | undefined;
  address: any;
  politicalState: string;
  city: string;
  zipCode: string;
  streetName: string;
  valueService: IValueService | null;
  seriesModels: TYear[];
  offersLoading: boolean;
  serviceOffers: IServiceOffer[];
  isMobileServiceOn: boolean;
  isPickUpDropOffServiceOn: boolean;
  isValueServiceOn: boolean;
  sideBarSteps: TScreen[];
  sideBarMenu: string[];
  sideBarActualSteps: { [K in TScreen]: number } | null;
  sideBarStepsList: TScreen[];
  welcomeScreenView: TView;
  language: TLanguage;
  ancillaryPriceLoading: boolean;
  ancillaryPrice: TAncillaryPriceByZip | null;
  filteredZipCodes: string[];
  selectedRecalls: IRecallByVin[];
  recallsAreShown: boolean;
  hoursOfOperations: IHOODataForm[];
  serviceTypeOption: IFirstScreenOption | null;
  selectedOptionTypes: EServiceType[];
  selectedServiceOptions: IFirstScreenOption[];
  prevSelectedOption: IFirstScreenOption | null;
  packagePricingType: EPackagePricingType | null;
  packagePriceTitles: TPackagePrice[];
  packageEMenuType: EMaintenanceOptionType | null;
  shouldShowServiceCentersList: boolean;
  isAppointmentSaving: boolean;
  appointmentByKey: IAppointmentByKey | null;
  carIsValidForUpdate: boolean;
  isUsualFlowNeeded: boolean;
  editingPosition: TEditingPosition | null;
  appointmentRequestsPrices: IServiceRequestPrice[];
  appointmentNotes: string;
  serviceOptionChangedFromSlotPage: boolean;
  transactionValue: number;
  passedScreens: TScreen[];
  consents: ICustomerConsentBooking[];
  acceptedConsentIds: number[];
  isConsentsLoading: boolean;
  filtersVisibility: TFiltersVisibility;
};

type TPackageOptionRequestData = {
  id: number;
  priceType: EPackagePricingType | null;
};

type TEMenuOption = {
  optionType: EMaintenanceOptionType | null;
};
export type TMaintenanceOption = TEMenuOption | TPackageOptionRequestData;

export type TDriverForRequest = {
  fullName: string;
  phoneNumber: string;
  city?: string;
  email: string | null;
};

export type TVehicleForRequest = {
  dmsId: string | null;
  engineTypeId: number | null;
  model: string | null;
  make: string | null;
  year: string | null;
  vin: string;
  mileage: number | null;
  modelDetails: string;
};

export interface ICreateAppointmentRequest {
  id?: number;
  appointmentTimingType: EAppointmentTimingType;
  customerId: string | number | null;
  driver: TDriverForRequest;
  vehicle: TVehicleForRequest;
  gmt: ParsableDate;
  offerId: number | null;
  reminderTypes: EReminderType[];
  serviceCenterId: number;
  advisor: string | null;
  transportationOptionId: number | null;
  slot: string;
  serviceRequests: IServiceRequestIds[];
  date: ParsableDate;
  serviceCategories: IServiceRequestIds[];
  maintenancePackageOption: TMaintenanceOption | null;
  valueServiceOfferIds: number[];
  searchTerm: string;
  serviceTypeOptionId: number | null;
  recalls: TRecallForRequest[];
  schedulerType?: EScheduler;
  notes: string;
  address: IAddressData | null;
  isWaitlist: boolean;
  customerConsentIds: number[];
  isAppointmentClone?: boolean;
}

export interface ISearchConsentsData {
  serviceCenterId: number;
  podId: number | null;
  serviceRequestIds: number[];
  make: string | null;
  model: string | null;
  modelYear: number | null;
  customerType: EUserType;
  appointmentTime: string;
  advisorId: string | null;
  zipCode?: string;
  serviceType: EServiceType;
  transportationOptionId: number | null;
  isWaitlistEnabled: boolean;
  appointmentRequestId?: number;
  maintenancePackageOptionId?: number;
}

export interface ICustomerConsentBooking {
  id: number;
  name: string;
  title: string;
  isEnabled: boolean;
  message: string;
}

export type TTrackerState = {
  isCreated: boolean;
  ids: string[];
};

export interface ILoadSlotsRequestData {
  timing: EAppointmentTimingType;
  date: TParsableDate;
  advisor: IServiceConsultant | null;
  transportation: ITransportation | null;
  address: any;
  zip: string;
  serviceTypeOption: IFirstScreenOption | null;
}
