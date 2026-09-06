import type React from 'react';
import { IAddressData } from '../../../../../api/types';
import {
  ICustomerForTable,
  ICustomerWithPhones,
} from '../../../../../store/reducers/enhancedCustomerSearch/types';
import { TArgCallback, TCallback } from '../../../../../types/types';
import { AppointmentSummaryI } from '../../../utils/types';
import { TColumn, TOffset, TSortColumn, TSortOrder } from '../types';

export type TCustomerSearchTableProps = {
  onClose: TCallback;
  loadData: TArgCallback<boolean>;
  isNewVehicleMode: boolean;
  redirect: TCallback;
  selectedColumns: TColumn[];
};

export type TRowActionHandlers = {
  onSelectCustomerForNewVehicle: (customer: ICustomerWithPhones) => () => Promise<void>;
  onCreateNewForCar: (customer: ICustomerWithPhones) => Promise<void>;
  onUpdateAppForCar: (customer: ICustomerWithPhones) => void;
  onCancelAppointment: (customer: ICustomerWithPhones) => Promise<void>;
  onViewRepairHistory: (customer: ICustomerWithPhones) => Promise<void>;
  onEditData: (customer: ICustomerWithPhones) => Promise<void>;
  onCancelEditing: () => void;
  onSaveInfo: () => Promise<void>;
};

export type TEditingHandlers = {
  onFieldChange: (
    fieldName: keyof ICustomerForTable
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressChange: (
    fieldName: keyof IAddressData
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type TTableViewProps = {
  classes: Record<string, string>;
  isLoading: boolean;
  selectedColumns: TColumn[];
  orderedColumns: TColumn[];
  offset: TOffset;
  sorting: TSortOrder;
  data: ICustomerWithPhones[];
  currentFirstItemIndex: number;
  currentLastItemIndex: number;
  isEdit: boolean;
  isNewVehicleMode: boolean;
  editingElement: ICustomerWithPhones | null;
  pagingNumberOfRecords?: number;
  pageIndex: number;
  pageSize: number;
  hashIdForSelectedAppointment: string | null | undefined;
  loadedAppointmentsByCar: AppointmentSummaryI[];
  selectedAppointmentForCancelOrEdit: ICustomerWithPhones | null;
  isEditAppointment: boolean;
  isOpenHistory: boolean;
  isOpenConfirm: boolean;
  isOpenAppointmentSelection: boolean;
  loadData: TArgCallback<boolean>;
  onSort: (order: TSortColumn) => void;
  getIsEdit: (customer: ICustomerWithPhones) => boolean;
  onCloseHistory: TCallback;
  resetSelectedAppointmentData: TCallback;
  onCloseConfirm: TCallback;
  handleCancelAppointment: (appointmentHashKey: string) => Promise<void>;
  handleUpdateAppointment: (customer: ICustomerWithPhones) => void;
  onCloseAppointmentSelection: TCallback;
  handleChangePage: (e: React.MouseEvent<Element, MouseEvent> | null, pageNumber: number) => void;
  handleChangeRows: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rowActionHandlers: TRowActionHandlers;
  editingHandlers: TEditingHandlers;
};
