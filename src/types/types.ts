import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store/rootReducer';
import { Action } from 'redux';
import { TRole } from '../store/reducers/users/types';
import React, { Dispatch, ReactElement, SetStateAction } from 'react';

import { AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material/useAutocomplete';

import { TextInputProps } from '../components/formControls/types';
import { Dayjs } from 'dayjs';
import { TTimePeriod } from '../store/reducers/schedules/types';
import { TDayType } from '../features/admin/AvailableStaffCalendar/types';
import { EServiceType } from '../store/reducers/appointmentFrameReducer/types';

export type LinkType = {
  to: string;
  name: string;
  roles: TRole[] | boolean;
  exact?: boolean;
  sub?: boolean;
};

export type LinkTypeWithSub = {
  to: string;
  name: string;
  roles: TRole[] | boolean;
  exact?: boolean;
  subLinks?: LinkType[];
  sub?: boolean;
};

export type ValidationKeyPairs<U> = {
  field: keyof U;
  message: string;
};

export interface ITimeSpan {
  ticks: number;
  days: number;
  hours: number;
  milliseconds: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMilliseconds: number;
  totalMinutes: number;
  totalSeconds: number;
}

export interface IPagingResponse {
  numberOfPages: number;
  numberOfRecords: number;
}

export interface IPageRequest {
  pageIndex: number;
  pageSize: number;
}

export interface PaginatedAPIResponse<T> {
  result: T[];
  paging: IPagingResponse;
}

export interface IAPIResponse<T> {
  result: T;
}

export type TTechnicianLevel = 1 | 2 | 3;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export interface IOrder<D = object> {
  orderBy?: keyof D | string;
  isAscending: boolean;
}

export type TOption = {
  name: string;
  value: string;
};
export type TCallback = () => void;
export type TArgCallback<T> = (arg: T) => void;

export type TSelectChange = (
  e: React.ChangeEvent<object>,
  value: string | null,
  reason: AutocompleteChangeReason,
  details?: AutocompleteChangeDetails<string> | undefined
) => void;

export type TView = 'select' | 'search' | 'confirm' | 'serviceSelect' | 'serviceCenterSelect';

export type TSwitchButton<U> = { label: string; type: U };

export type TSwitchButtonsProps<U = string> = {
  onClick: (s: U) => () => void;
  active: U;
  buttons: TSwitchButton<U>[];
};

export type TTitle = {
  title: string;
  to: string;
  parent?: TTitle;
};

export type TSearchInputProps = TextInputProps & {
  onSearch: () => void;
  delay?: number;
  value?: string;
  placeholder?: string;
};
export type AlignTypes = 'inherit' | 'left' | 'center' | 'right' | 'justify';
export type VerticalAlignTypes = 'inherit' | 'top' | 'center' | 'bottom' | 'middle';
export type TableRowDataType<DataEl> = {
  header: string | ReactElement;
  orderId?: keyof DataEl | string;
  val: (el: DataEl, idx: number) => string | JSX.Element | undefined | null;
  align?: AlignTypes;
  verticalAlign?: VerticalAlignTypes;
  width?: number | string;
  required?: boolean;
};
export type TableRowDataTypeResp<DataEl> = TableRowDataType<DataEl> & {
  xsHidden?: boolean;
  hide?: boolean;
};

export interface ITableProps<Data> {
  smallHeaderFont?: boolean;
  superCompact?: boolean;
  compact?: boolean;
  compactBodyPadding?: boolean;
  order?: keyof Data | string;
  onSort?: (order: IOrder<Data>) => () => void;
  isAscending?: boolean;
  hidePagination?: boolean;
  data: Data[];
  index?: keyof Data;
  rowData: TableRowDataTypeResp<Data>[];
  onChangePage?: (e: React.MouseEvent<Element, MouseEvent> | null, page: number) => void;
  changePageCb?: (page: number, pageSize: number) => void;
  changeRowsPerPageCb?: (rowsPerPage: number) => void;
  onChangeRowsPerPage?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  page?: number;
  count?: number;
  rowsPerPage?: number;
  startActions?: (el: Data) => JSX.Element;
  actions?: (el: Data) => JSX.Element;
  noDataTitle?: string;
  isLoading?: boolean;
  viewMode?: boolean;
  hideHeader?: boolean;
  borderHeader?: boolean;
  withBorders?: boolean;
  actionsAlign?: 'center' | 'left' | 'right';
  withoutOverflow?: boolean;
  verticalAlign?: string;
  getKey?: (el: Data) => string;
  verticalPadding?: number;
}

export interface TError {
  field: string;
  message: string;
}

export type EMaintenanceItemType = 'category' | 'package' | 'service' | 'valueService' | 'recall';
export type IMaintenanceItem = {
  id?: number;
  name: string;
  type: EMaintenanceItemType;
  campaignNumber?: string;
};

export interface IRecallByVin {
  id: number | null;
  serviceRequestId: number;
  campaignNumber?: string;
  recallComponent: string;
  recallStatus: string;
  shortDescription: string;
  recallOpenDate?: string;
  summary?: string;
  safetyRisk?: string;
  isRemedyAvailable: boolean;
  rolloverMessage?: string;
  oemProgram?: string;
}

export type TActionProps = {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  loading?: boolean;
  onAddServices?: () => void;
  prevDisabled?: boolean;
  prevLabel?: string;
  hideNext?: boolean;
  hidePrev?: boolean;
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  removeTopMargin?: boolean;
};

export enum Roles {
  EvenFlowAdmin = 'EvenFlow Admin',
  EvenFlowAccountManager = 'EvenFlow Account Manager',
  EvenFlowSupport = 'EvenFlow Support',
  EvenFlowAIAgent = 'EvenFlow Agentic AI Configuration Agent',
  DealerOwner = 'Dealer Owner',
  ServiceDirector = 'Service Director',
  ServiceManager = 'Service Manager',
  BDCManager = 'BDC Manager',
  BDCAgent = 'BDC Agent',
  Advisor = 'Advisor',
  Technician = 'Technician',
  Staff = 'Staff',
  Vendor = 'Vendor',
  AIBookingAgent = 'AI Booking Agent'
}

export enum Titles {
  DealershipGroups = 'Dealership Groups',
  Employees = 'Employees',
  ServiceCenters = 'Service Centers',
  Appointments = 'Appointments',
  Pricing = 'Pricing',
  OperationalSetUp = 'Operational Set Up',
  CapacityOptimization = 'Capacity Optimization',
  Reporting = 'Reporting',
  Vehicles = 'Vehicles',
}

export enum LocalItems {
  selectedSC = 'SSCID',
}

export type TIdAndName = {
  id: number;
  name: string;
};

export type ParsableDate = object | string | number | Date | null | undefined;
export type TParsableDate = string | number | Date | Dayjs | null | undefined;

export type TAutocompleteChangeReason =
  | 'createOption'
  | 'selectOption'
  | 'removeOption'
  | 'blur'
  | 'clear';
export type TDayPeriod = 'am' | 'pm';

export interface IDataCalendarProps<Data> {
  data: Data[];
  firstIcon: ReactElement;
  secondIcon: ReactElement;
  firstIconFieldName: keyof Data;
  secondIconFieldName: keyof Data;
  date: TParsableDate;
  setDate: Dispatch<SetStateAction<TParsableDate>>;
  dateFieldName: keyof Data;
  onDayClick: (data: Data | undefined, date: TParsableDate, dayType: TDayType) => void;
  index?: keyof Data;
  firstIconText?: string;
  secondIconText?: string;
  setTimePeriod: Dispatch<SetStateAction<TTimePeriod | null>>;
  timePeriod: TTimePeriod | null;
  disabledDates?: TParsableDate[];
  loading?: boolean;
}

export type TGeographicZoneShort = {
  id: number;
  name: string;
  serviceType: EServiceType;
};
export type TDashboardItem = {
  label: string;
  icon: JSX.Element;
  action: () => void;
};
export type TDashboardCountData = {
  technicians: number;
  bays: number;
  pods: number;
  appointments: number;
};
export type TDashboardDataMap = {
  label: string;
  value: keyof TDashboardCountData;
};
