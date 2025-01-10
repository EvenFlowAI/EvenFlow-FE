import {
  TSCNotifications,
  TTransportationNotifications,
} from '../../../store/reducers/notifications/types';

export const initialSCNotifications: TSCNotifications = {
  isActive: false,
  employees: [],
};

export const initialTransportationNotifications: TTransportationNotifications = {
  isActive: false,
  transportationOptions: [],
};
