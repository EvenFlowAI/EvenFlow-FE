import { EMaintenanceOptionType } from '../../../api/types';

export const MaintenanceOptionTypes = [
  {
    name: 'Base',
    value: EMaintenanceOptionType.Base,
  },
  {
    name: 'Value',
    value: EMaintenanceOptionType.Value,
  },
  {
    name: 'Preferred',
    value: EMaintenanceOptionType.Preferred,
  },
];

export const defaultComplimentaryTitle = 'Complimentary';

export const defaultUpsellTitle = 'Interval Upsell';

export const MaintenanceOptions = {
  0: 'Base',
  1: 'Value',
  2: 'Preferred',
};
