import { ECustomerProfileType } from '../api/types';

export type TCustomerDisplayNameData = {
  customerProfileType?: ECustomerProfileType;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
};

export const getCustomerDisplayName = (customer?: TCustomerDisplayNameData | null): string => {
  if (!customer) {
    return '';
  }

  const profileType = customer.customerProfileType;
  const companyName = customer.companyName?.trim() ?? '';
  const isBusiness =
    profileType === ECustomerProfileType.Business || (profileType == null && Boolean(companyName));

  if (isBusiness) {
    return companyName;
  }

  const personalName = [customer.firstName, customer.lastName]
    .map(value => value?.trim())
    .filter(Boolean)
    .join(' ');

  return personalName || customer.fullName?.trim() || '';
};
