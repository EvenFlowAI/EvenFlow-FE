import { TRole } from '../store/reducers/users/types';
import { EStates } from '../types/states';
import { IServiceCenterFlag, TGAOptions } from './types';
import { Routes } from '../routes/constants';
import { TReviewOption } from '../store/reducers/globalVehicles/types';
import { Roles, TTitle } from '../types/types';

export const states = Object.values(EStates);

export const WeekDayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const availableUserRoles: TRole[] = [
  Roles.EvenFlowAdmin,
  Roles.EvenFlowAccountManager,
  Roles.EvenFlowSupport,
  Roles.EvenFlowAIAgent,
  Roles.DealerOwner,
  Roles.ServiceDirector,
  Roles.ServiceManager,
  Roles.BDCManager,
  Roles.BDCAgent,
  Roles.Advisor,
  Roles.Technician,
  Roles.Staff,
  Roles.Vendor,
  Roles.AIBookingAgent,
];
export const canNotBookAppointmentRoles: TRole[] = [
  Roles.EvenFlowAIAgent,
  Roles.Technician,
  Roles.Vendor,
];

export const dealerShipAccessRoles: TRole[] = [
  Roles.EvenFlowAdmin,
  Roles.EvenFlowAccountManager,
  Roles.EvenFlowSupport,
  Roles.EvenFlowAIAgent,
  Roles.DealerOwner,
  Roles.ServiceDirector,
  Roles.BDCManager,
  Roles.BDCAgent,
];

export const timeSpanString = 'HH:mm:ss';
export const time12HourSeconds = 'hh:mm:ss';
export const time12HourFormat = 'h:mm a';
export const dateTimeString = 'ddd, MMM D, h:mm A';
export const time24HourFormat = 'hh:mm A';
export const hourFormat = 'h:mm';
export const twelveHourFormat = 'hh:mm';

export const SC_UNDEFINED = 'Service center is not loaded';
export const SOMETHING_WRONG = 'Something wrong';
export const G_CALENDAR_FORMAT = 'YYYYMMDDT';
export const CALENDAR_FORMAT = 'YYYY-MM-DD';
export const calendarDateFormat = 'ddd, MMM D';

export const capacityManagementRoot: TTitle = {
  to: Routes.CapacityManagement.Base,
  title: 'Capacity Management',
};

export const demandManagementRoot: TTitle = {
  to: Routes.CapacityManagement.DemandManagement,
  title: 'Demand Management',
};

export const servicesRoot: TTitle = {
  to: Routes.Services.Base,
  title: 'Services',
};

export const bookingFlowRoot: TTitle = {
  to: Routes.BookingFlow.Base,
  title: 'Booking Experience',
};

export const dealerOperationsRoot: TTitle = {
  to: Routes.Dealer.Base,
  title: 'Dealer Operations',
};

export const dealerOperationsCustomer: TTitle = {
  to: Routes.Dealer.DealerCustomer,
  title: 'Customer',
};

export const pricingRoot: TTitle = {
  to: Routes.Pricing.Base,
  title: 'Dynamic Pricing',
};

export const employeesRoot: TTitle = {
  to: Routes.Employees.Base,
  title: 'Employees',
};

export const centerProfileRoot: TTitle = {
  to: Routes.CenterProfile.Base,
  title: 'Center Profile',
};

export const applicationRoot: TTitle = {
  to: Routes.Admin.Application,
  title: 'Application',
};

export const SCREENS = {
  carSelection: 'Car Selection',
  serviceNeeds: 'Service Needs',
  packageSelection: 'Package Selection',
  maintenanceDetails: 'Car Details',
  carDetails: 'Car Details',
  consultantSelection: 'Consultant Selection',
  serviceSelection: 'Service Selection',
  describeMore: 'Describe More',
  appointmentConfirmation: 'Appointment Confirmation',
  appointmentSelection: 'Appointment Selection',
  appointmentConfirmed: 'Appointment Confirmed',
  appointmentTiming: 'Appointment Timing',
  transportationNeeds: 'Transportation Needs',
  opsCode: 'opsCode',
  vehicleData: 'vehicleData',
  location: 'Your Location',
  payment: 'payment',
  serviceOfferProductPage: 'Service Offer Produce Page',
  manageAppointment: 'Manage Appointment',
};
export const options: TGAOptions = {
  siteSpeedSampleRate: 100,
  cookieDomain: 'auto',
  allowLinker: true,
  storage: 'none',
};
export const reviewOptions: TReviewOption[] = ['Not Reviewed', 'Confirmed', 'Override'];

export const DealershipsIds: IServiceCenterFlag = {
  Dealerbuilt: [16, 184],
  Fremont: [10, 150],
  LakePowellFord: [13],
  BmwSchererville: [7],
  Dominion: [11],
  RiverViewFord: [5],
  Bountiful: [118],
  Walser: [150],
  TomWoodVW: [217],
};

export const parentOrigins = {
  bmwofschererville: 'bmwofschererville',
  riverviewford: 'riverviewford',
  scherervilleEvenflow: 'bmw-schererville.evenflow',
  fremontchryslerdodgejeepcasper: 'fremontchryslerdodgejeepcasper',
  fremontchryslerdodgejeeprocksprings: 'fremontchryslerdodgejeeprocksprings',
  janssenchryslerjeepdodge: 'janssenchryslerjeepdodge',
  janssenfordholdrege: 'janssenfordholdrege',
  lakepowellford: 'lakepowellford',
  larnedford: 'morrissmithfordoflarned',
  performancekingshonda: 'performancekingshonda',
  performancehondastore: 'performancehondastore',
  performancelexus: 'performancelexus',
  performancelexusrivercenter: 'performancelexusrivercenter',
  performancechryslerjeepcenterville: 'performancechryslerjeepcenterville',
  performancetoyotastore: 'performancetoyotastore',
  subaru: 'subaru',
};

export const DEFAULT_SIDEBAR_HEX = '252525';

export const PARTNER_APP_AUTH_EVENT = 'EVENFLOW_AUTH';
