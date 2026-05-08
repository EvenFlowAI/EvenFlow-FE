import { TMaintenanceDetails } from '../../../../../store/reducers/appointmentFrameReducer/types';
import { EServiceCategoryPage, ILoadedVehicle } from '../../../../../api/types';
import { IEngineType } from '../../../../../store/reducers/vehicleDetails/types';
import { Dispatch, SetStateAction } from 'react';
import { TArgCallback, TCallback } from '../../../../../types/types';
import { TScreen } from '../../../../../types/screens';

export type TKey = keyof TMaintenanceDetails | keyof ILoadedVehicle;
export type TOptionsState = { [s: string]: string[] };
export type TOrderStyles = {
  [s: string]: { order: number };
};
export type TTabOrderField =
  | 'make'
  | 'mileage'
  | 'model'
  | 'engineType'
  | 'year'
  | 'vin'
  | 'backButton'
  | 'nextButton';
export type TTabOrderMap = Record<TTabOrderField, number>;

export type TFormProps = {
  orderMapStyles: TOrderStyles;
  tabOrderMap: TTabOrderMap;
  isExistingVehicle: boolean;
  requiredFields: TKey[];
  loadedOptions: TOptionsState;
  selectedEngine: IEngineType | null;
  setLoadedOptions: Dispatch<SetStateAction<TOptionsState>>;
  setSelectedEngine: Dispatch<SetStateAction<IEngineType | null>>;
  errors: TKey[];
  setErrors: Dispatch<SetStateAction<TKey[]>>;
  isExistingSelectedVehicle?: ILoadedVehicle;
};
export type TMaintenanceDetailsProps = {
  onBack: TArgCallback<TScreen>;
  serviceCategoryPage: EServiceCategoryPage;
  handleNext: TCallback;
};
