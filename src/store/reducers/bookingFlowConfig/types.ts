import { EServiceType } from '../appointmentFrameReducer/types';

export type TServiceTypeSettings = {
  available: boolean;
  valueService: boolean;
  productPageForValueService: boolean;
  advisorSelection: boolean;
  serviceType: EServiceType;
  engineType: boolean;
  appointmentSelection: boolean;
  transportationNeeds: boolean;
  checkRecallsExisting: boolean;
  checkRecallsNew: boolean;
};

export interface InitialState {
  config: TServiceTypeSettings[];
  isLoading: boolean;
  currentConfig: TServiceTypeSettings | null;
  isAdvisorAvailable: boolean;
  isTransportationAvailable: boolean;
  isAppointmentTimingAvailable: boolean;
}
