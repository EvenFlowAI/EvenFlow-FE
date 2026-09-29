import { ECustomerProfileType, ICustomerLoadedData } from '../../../../../../../api/types';
import { IUpdateCustomerData } from '../../../../../../../store/reducers/enhancedCustomerSearch/types';
import { TPhoneType, TPhoneValues } from './types';

export const phoneTypes: { type: TPhoneType; label: string; placeholder: string }[] = [
  { type: 'cell', label: 'Cell', placeholder: 'Cell phone' },
  { type: 'home', label: 'Home', placeholder: 'Home phone' },
  { type: 'work', label: 'Work', placeholder: 'Work phone' },
  { type: 'other', label: 'Other', placeholder: 'Other phone' },
];

export const getInitialPhones = (customerLoadedData: ICustomerLoadedData): TPhoneValues => ({
  cell: customerLoadedData.phoneNumbersByCategory?.cell ?? '',
  home: customerLoadedData.phoneNumbersByCategory?.home ?? '',
  work: customerLoadedData.phoneNumbersByCategory?.work ?? '',
  other: customerLoadedData.phoneNumbersByCategory?.other ?? '',
});

export const getProfileType = (customerLoadedData: ICustomerLoadedData): ECustomerProfileType =>
  customerLoadedData.customerProfileType ?? ECustomerProfileType.Personal;

export const hasCustomerChanges = (
  data: IUpdateCustomerData,
  customerLoadedData: ICustomerLoadedData,
  initialPhones: TPhoneValues
): boolean =>
  data.firstName !== (customerLoadedData.firstName ?? '').trim() ||
  data.middleName !== (customerLoadedData.middleName ?? '').trim() ||
  data.lastName !== (customerLoadedData.lastName ?? '').trim() ||
  (data.companyName ?? '') !== (customerLoadedData.companyName ?? '').trim() ||
  data.email !== (customerLoadedData.emails[0] ?? '').trim() ||
  data.cellPhone !== initialPhones.cell.trim() ||
  data.homePhone !== initialPhones.home.trim() ||
  data.workPhone !== initialPhones.work.trim() ||
  data.otherPhone !== initialPhones.other.trim();
