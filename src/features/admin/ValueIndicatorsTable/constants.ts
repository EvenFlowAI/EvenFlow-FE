import { TColumn, TData, TRow } from './types';
import { Indicators, IValueSettings } from '../../../store/reducers/valueSettings/types';

export const rows: TRow[] = [
  { id: Indicators.NewCustomer, title: 'New Customer', tab: '4' },
  { id: Indicators.LostCustomer, title: 'Lost Customer', tab: '4' },
  { id: Indicators.UrgencyFlag, title: 'Urgency Flag', tab: '3' },
  { id: Indicators.EndOfWarranty, title: 'End of Warranty', tab: '5' },
  { id: Indicators.CustomerLifetimeLow, title: 'Customer Lifetime: Low', tab: '2' },
  { id: Indicators.CustomerLifetimeHigh, title: 'Customer Lifetime: High', tab: '2' },
];

export const blankRow: IValueSettings = {
  point: 0,
  serviceCenterId: 0,
  state: 0,
  type: Indicators.NewCustomer,
};

export const initialData: TData = rows.reduce((acc, i) => {
  return { ...acc, [i.id]: { ...blankRow, type: i.id } };
}, {} as TData);

export const columns: TColumn[] = [
  { label: 'Value Lever', id: 0, width: '25%' },
  { label: 'Optimization Settings', id: 1, width: 'auto' },
  { label: 'OFF/ON', id: 2, width: '10%' },
  { label: '', id: 3, width: '150px', cellProps: { align: 'right' } },
];
