export enum ERequestDemandMethod {
  AppointmentSlots,
  ScheduledHours,
}

export enum EPredictedDemandMethod {
  Predicted,
  Probability,
}

export type TPredictedDemandMethod = {
  method: EPredictedDemandMethod;
  isConfigured: boolean;
};

export enum EDemandPredictionType {
  EvenFlowAppointments,
  ExEvenFlowAppointments,
  OpenROs,
}

export type TDemandActivity = {
  type: EDemandPredictionType;
  isRequestStatusOn: boolean;
  isPredictedStatusOn: boolean;
};

export interface IBaseDemandPrediction {
  serviceCenterId: number;
  podId?: number;
  requestDemandMethod: ERequestDemandMethod;
  predictedDemandMethod: EPredictedDemandMethod;
  demandTypeSettings: TDemandActivity[];
}

export interface IDemandPrediction extends IBaseDemandPrediction {
  serviceBookName: string;
  predictedDemandMethodSettings: TPredictedDemandMethod[];
}

export interface TState {
  isLoading: boolean;
  settings: IDemandPrediction[];
  availability: {
    openAppointmentDate: string;
    openAppointmentDateTimes: string[];
  }[];
}
