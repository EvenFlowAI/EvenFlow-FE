import { IAddressData, ICustomerLoadedData } from '../../../../../api/types';
import {
  EServiceType,
  EUserType,
} from '../../../../../store/reducers/appointmentFrameReducer/types';
import { ETransportationType } from '../../../../../store/reducers/transportationNeeds/types';
import {
  ICustomerForTable,
  ICustomerWithPhones,
} from '../../../../../store/reducers/enhancedCustomerSearch/types';
import { TColumn, TSortColumn } from '../types';

const prioritizedColumns = ['Last Name', 'First Name', 'Make', 'Model', 'VIN', 'Year'];

export const getOrderedColumns = (columns: TColumn[]): TColumn[] => {
  const ordered = prioritizedColumns
    .map(name => columns.find(column => column.name === name))
    .filter((column): column is TColumn => Boolean(column));

  const rest = columns.filter(column => !prioritizedColumns.includes(column.name));

  return [...ordered, ...rest];
};

export const sortByColumn = (
  first: ICustomerWithPhones,
  second: ICustomerWithPhones,
  order: TSortColumn,
  isAscending: boolean
): number => {
  const firstValue = first[order];
  const secondValue = second[order];

  if (!firstValue && secondValue) {
    return isAscending ? 1 : -1;
  }

  if (!secondValue && firstValue) {
    return isAscending ? -1 : 1;
  }

  if (!firstValue && !secondValue) {
    return isAscending ? 1 : -1;
  }

  const firstText = firstValue.toString();
  const secondText = secondValue.toString();

  return isAscending ? secondText.localeCompare(firstText) : firstText.localeCompare(secondText);
};

export const getTableColumnWidth = (name: string, index: number): number | 'auto' => {
  if (name === 'Last Name' || name === 'First Name') {
    return 150;
  }

  if (name === 'Year') {
    return 60;
  }

  if (name === 'Address') {
    return 225;
  }

  if (name === 'State' || name === 'ZIP') {
    return 70;
  }

  return index > 0 && index < 7 ? 150 : 'auto';
};

export const getServiceType = (
  serviceTypeOptionType: EServiceType | null,
  transportationType: ETransportationType | undefined
): EServiceType => {
  if (serviceTypeOptionType) {
    return serviceTypeOptionType;
  }

  return transportationType === ETransportationType.PickUpDelivery
    ? EServiceType.PickUpDropOff
    : EServiceType.VisitCenter;
};

export const getTransportationOptionId = (
  serviceType: EServiceType,
  serviceTypeTransportationOptionId?: number,
  transportationId?: number
): number | undefined => {
  if (serviceType === EServiceType.VisitCenter) {
    return serviceTypeTransportationOptionId ?? transportationId;
  }

  if (serviceType === EServiceType.PickUpDropOff) {
    return serviceTypeTransportationOptionId;
  }

  return undefined;
};

export const shouldLoadRecalls = (
  customer: ICustomerWithPhones,
  shouldCheckRecalls: boolean
): boolean =>
  Boolean(
    customer?.vin?.length &&
    customer?.make &&
    customer?.model &&
    customer?.year &&
    shouldCheckRecalls
  );

export const getPhoneNumbersByCategory = (customer?: ICustomerWithPhones | null) => ({
  cell: customer?.cellPhone,
  home: customer?.homePhone,
  other: customer?.otherPhone,
});

export const buildVehicle = (customer: ICustomerWithPhones) => ({
  vin: customer.vin,
  make: customer.make,
  model: customer.model,
  year: customer.year,
  appointmentHashKeys: customer.appointmentHashKey ? [customer.appointmentHashKey] : [],
  mileage: customer?.mileage ?? null,
  dmsId: customer.vehicleDmsId,
  hasRepairOrders: Boolean(customer.hasOrders),
  engineTypeId: customer.engineTypeId ?? null,
  id: customer.vehicleId,
});

export const buildCustomerLoadedData = ({
  customer,
  selectedCustomer,
  isUpdating,
  includeVehicles,
}: {
  customer: ICustomerWithPhones;
  selectedCustomer?: ICustomerWithPhones;
  isUpdating?: boolean;
  includeVehicles: boolean;
}): ICustomerLoadedData => {
  const fallbackPhoneNumber = customer.cellPhone ?? customer.homePhone ?? customer.otherPhone;
  const phoneNumbers = fallbackPhoneNumber ? [fallbackPhoneNumber] : [];

  if (selectedCustomer?.homePhone && !phoneNumbers.includes(selectedCustomer.homePhone)) {
    phoneNumbers.push(selectedCustomer.homePhone);
  }

  const customerData: ICustomerLoadedData = {
    emails: customer?.email ? [customer.email] : [],
    firstName: customer?.firstName ?? '',
    lastName: customer?.lastName ?? '',
    companyName: customer?.companyName ?? '',
    id: customer.customerId?.toString() ?? null,
    phoneNumbers,
    phoneNumbersByCategory: getPhoneNumbersByCategory(selectedCustomer ?? customer),
    vehicles: includeVehicles ? [buildVehicle(customer)] : [],
    fromSearchByName: true,
  };

  if (typeof isUpdating === 'boolean') {
    customerData.isUpdating = isUpdating;
  }

  return customerData;
};

export const resolveAddress = (
  selectedCustomer: ICustomerWithPhones | undefined,
  isUpdating: boolean
): IAddressData | null => {
  if (!selectedCustomer) {
    return null;
  }

  if (isUpdating && selectedCustomer.appointmentAddress) {
    return selectedCustomer.appointmentAddress;
  }

  return selectedCustomer.address ?? null;
};

export const getIsEditRow = (
  isEdit: boolean,
  editingElement: ICustomerWithPhones | null,
  customer: ICustomerWithPhones
): boolean =>
  Boolean(
    isEdit &&
    editingElement?.vehicleId === customer.vehicleId &&
    editingElement?.customerId === customer.customerId
  );

export const hasColumn = (columns: TColumn[], name: string): boolean =>
  columns.some(column => column.name === name);

export const customerIdentityMatches = (
  first: ICustomerWithPhones | null,
  second: ICustomerWithPhones
): boolean => first?.vehicleId === second.vehicleId && first?.customerId === second.customerId;

export const getSortOrderDifference = (
  first: ICustomerWithPhones,
  second: ICustomerWithPhones
): number => {
  if (first.sortOrder == null || second.sortOrder == null) {
    return 0;
  }

  return first.sortOrder - second.sortOrder;
};

export const isEditableCustomerField = (
  fieldName: keyof ICustomerWithPhones
): fieldName is keyof ICustomerForTable => {
  return [
    'lastName',
    'firstName',
    'companyName',
    'homePhone',
    'cellPhone',
    'otherPhone',
    'email',
  ].includes(fieldName);
};

export const EXISTING_USER_TYPE = EUserType.Existing;
