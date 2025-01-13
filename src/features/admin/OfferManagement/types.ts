import {
  ECustomerPresence,
  ECustomerSegment,
  EDayOfWeek,
  EOfferType,
  IOffer,
} from '../../../store/reducers/offers/types';
import {
  IAssignedServiceRequestShort,
  IServiceRequestPriority,
} from '../../../store/reducers/serviceRequests/types';
import { ICategory } from '../../../store/reducers/categories/types';
import React from 'react';
import { TEnumMap } from '../../../store/reducers/types';
import { Dayjs } from 'dayjs';

export type TOfferForm = {
  offerValue?: string;
  offerTitle?: string;
  offerType: EOfferType;
  serviceRequests: IAssignedServiceRequestShort[];
  serviceCategories: ICategory[];
  customerSegments: TEnumMap<ECustomerSegment>[];
  customerPresence: ECustomerPresence;
  dayOfWeek: TEnumMap<EDayOfWeek>[];
  timeOfDayFrom?: Dayjs;
  timeOfDayTo?: Dayjs;
  durationFrom?: Dayjs;
  durationTo?: Dayjs;
  serviceType?: string;
  isProductPageOn?: boolean;
};
export const selectAllSR: IAssignedServiceRequestShort = {
  id: 0,
  code: 'All',
  priority: IServiceRequestPriority.Default,
  description: '',
};

export enum EAudience {
  All,
  New,
  NewWarranty,
  HighCustomerValue,
  MediumCustomerValue,
  LastVisit90,
}

export enum EChannel {
  Text,
  Email,
  Both,
}

export type TForm = {
  offer?: IOffer;
  audience?: EAudience;
  channel: EChannel;
};

export type TAutoChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;
