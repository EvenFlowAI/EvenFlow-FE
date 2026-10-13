import { ECommunicationPhoneType, ECustomerProfileType, IDriverInfo } from '../api/types';

type TCustomerPhones = Pick<
  IDriverInfo,
  'phoneNumber' | 'cellPhone' | 'homePhone' | 'workPhone' | 'otherPhone'
>;

/** API may return the profile type either as a string ('Personal' | 'Business') or as a number (0 | 1). */
export const normalizeCustomerProfileType = (value: unknown): ECustomerProfileType | undefined => {
  if (value === ECustomerProfileType.Business || value === 1 || value === '1') {
    return ECustomerProfileType.Business;
  }
  if (value === ECustomerProfileType.Personal || value === 0 || value === '0') {
    return ECustomerProfileType.Personal;
  }
  return undefined;
};

const getPhoneByType = (
  customer: TCustomerPhones,
  type: ECommunicationPhoneType
): string | undefined => {
  switch (type) {
    case ECommunicationPhoneType.CellPhone:
      return customer.cellPhone;
    case ECommunicationPhoneType.WorkPhone:
      return customer.workPhone;
    case ECommunicationPhoneType.HomePhone:
      return customer.homePhone;
    case ECommunicationPhoneType.OtherPhone:
      return customer.otherPhone;
    default:
      return undefined;
  }
};

/** Resolves the appointment communication number from the customer phones and communicationPhoneType. */
export const getAppointmentCustomerPhone = (
  customer: TCustomerPhones | null | undefined,
  communicationPhoneType?: ECommunicationPhoneType | null,
  appointmentPhoneNumber?: string | null
): string => {
  const byType =
    customer && communicationPhoneType !== null && communicationPhoneType !== undefined
      ? getPhoneByType(customer, communicationPhoneType)
      : undefined;
  return (
    byType ||
    appointmentPhoneNumber ||
    customer?.phoneNumber ||
    customer?.cellPhone ||
    customer?.homePhone ||
    customer?.workPhone ||
    customer?.otherPhone ||
    ''
  );
};
