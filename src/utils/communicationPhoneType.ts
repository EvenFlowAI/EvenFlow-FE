import { ECommunicationPhoneType, ICustomerLoadedData } from '../api/types';

export type TPhoneCategory = 'cell' | 'home' | 'work' | 'other';

type TPhonesByCategory = ICustomerLoadedData['phoneNumbersByCategory'];

export const phoneCategoryToCommunicationType: Record<TPhoneCategory, ECommunicationPhoneType> = {
  cell: ECommunicationPhoneType.CellPhone,
  work: ECommunicationPhoneType.WorkPhone,
  home: ECommunicationPhoneType.HomePhone,
  other: ECommunicationPhoneType.OtherPhone,
};

export const communicationTypeToPhoneCategory: Record<ECommunicationPhoneType, TPhoneCategory> = {
  [ECommunicationPhoneType.CellPhone]: 'cell',
  [ECommunicationPhoneType.WorkPhone]: 'work',
  [ECommunicationPhoneType.HomePhone]: 'home',
  [ECommunicationPhoneType.OtherPhone]: 'other',
};

const phoneCategoriesOrder: TPhoneCategory[] = ['cell', 'home', 'work', 'other'];

/** Finds the phone category whose number matches the given phone (fallback when the type is unknown). */
export const getCommunicationPhoneTypeByNumber = (
  phonesByCategory: TPhonesByCategory,
  phone?: string | null
): ECommunicationPhoneType | null => {
  const value = phone?.trim();
  if (!phonesByCategory || !value) return null;
  const category = phoneCategoriesOrder.find(key => phonesByCategory[key]?.trim() === value);
  return category ? phoneCategoryToCommunicationType[category] : null;
};
