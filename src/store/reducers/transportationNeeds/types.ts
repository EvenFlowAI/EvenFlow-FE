export interface ITransportationOptionRules {
  isAllServiceRequestsIncluded?: boolean;
  duration?: {
    start: string;
    end: string;
  };
  timeOfDay?: {
    start: string;
    end: string;
  };
  dayOfWeeks?: number[];
  serviceRequests?: number[];
  capacity?: number;
  slotsCount?: number;
}

export interface ITrOptionServiceTRequest {
  id: number;
  code: string;
  description: string;
  priority: string | number;
  price: number;
}

export interface ITransportationOptionRule {
  id?: number;
  name: string;
  transportationOptionId: number;
  timeOfDay: {
    start: string;
    end: string;
  };
  dayOfWeeks: number[];
  isAllServiceRequestsIncluded?: boolean;
  serviceRequests: ITrOptionServiceTRequest[];
  serviceRequestFilterMode?: number;
  capacity?: number;
  state: number;
  orderIndex: number;
}

export interface INewTransportationOption {
  type: ETransportationType;
  state: number;
  serviceCenterId: number;
}

export interface ITransportationOptionFull extends INewTransportationOption {
  id: number;
  description: string;
  orderIndex: number;
  iconPath?: string;
  rules?: ITransportationOptionRule[];
  serviceRequestId?: number;
  opCode?: string;
}

export enum ECustomerSegment {
  All,
  New,
  LowValue,
  MediumValue,
  HighValue,
  EndOfWarranty,
}

export enum ETransportationType {
  Shuttle,
  Loaner,
  Rental,
  Ride,
  WaitAtDealership,
  DropOffVehicle,
  NightTimeDropOff,
  PickUpDelivery,
}

export enum ETransportationDays {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  EveryDay,
}

export type TState = {
  options: ITransportationOptionFull[];
  isLoading: boolean;
  optionsShort: TTransportationShort[];
};

export type TTransportationShort = {
  id: number;
  name: string;
};
