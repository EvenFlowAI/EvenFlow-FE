export enum ERequestDemandMethod {
    AppointmentSlots, ScheduledHours
}

export enum EPredictedDemandMethod {
    Predicted, Probability
}

export type TPredictedDemandMethod = {
    type: EPredictedDemandMethod;
    configured: boolean;
}

export enum EDemandPredictionType {
    EvenFlowAppointments, ExEvenFlowAppointments, OpenROs
}

export type TDemandActivity = {
    type: EDemandPredictionType;
    isRequestOn: boolean;
    isPredictionOn: boolean;
}

export interface IDemandPrediction {
    serviceBookName: string;
    serviceBookId?: number;
    requestDemandMethod: ERequestDemandMethod;
    predictedDemandMethod: TPredictedDemandMethod;
    demandActivity: TDemandActivity[];
}