import { TRole } from "../store/reducers/users/types";
import { IRemappedAppointmentSlot } from "../store/reducers/appointment/types";
import { TParsableDate } from "../types/types";

export type TCalendarProps = {
  text: string;
  dates: string[];
  location: string;
  timeZone?: string;
  details?: string;
};
export type TRouteRoleMap = {
  route: string;
  roles: TRole[] | boolean;
};

export type TGroupedAppointment = {
  date: TParsableDate;
  lowestPrice: number;
  idx: string;
  offers: boolean;
  appointments: IRemappedAppointmentSlot[];
  amountOfSavingMoney?: number;
  ancillaryPrice: number;
};
export type TGroupedAppointments = {
  [k: string]: TGroupedAppointment;
};

export type TOption = {
  value: number;
  name: string;
};

export type TTextParams = {
  label: string;
  fullWidth?: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  required?: boolean;
  key?: string;
};

export type TGAOptions = {
  siteSpeedSampleRate: number;
  cookieDomain: string;
  allowLinker: boolean;
  storage: string;
  clientId?: string;
  name?: string;
};

export type GATrackers = {
  measurementId: string;
  gmtId?: string;
};

export type TReactGATracker = {
  trackingId: string;
  gaOptions: TGAOptions;
};

export type IServiceCenterFlag = {
  Dealerbuilt: number[];
  Fremont: number[];
  LakePowellFord: number[];
  BmwSchererville: number[];
  Dominion: number[];
  RiverViewFord: number[];
  Bountiful: number[];
  Walser: number[];
};
