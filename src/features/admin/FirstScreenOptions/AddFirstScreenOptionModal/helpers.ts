import { EServiceType } from '../../../../store/reducers/appointmentFrameReducer/types';
import {
  IFirstScreenOption,
  TNewFirstScreenOption,
  TUpdateFirstScreenOption,
} from '../../../../store/reducers/serviceTypes/types';
import {
  ETransportationType,
  ITransportationOptionFull,
} from '../../../../store/reducers/transportationNeeds/types';
import { TOption } from '../../../../types/types';
import { serviceTypeNames } from '../constants';

type TValidateParams = {
  selectedServiceType: TOption | null;
  orderIndex: string;
  isPickUpDropOffType: boolean;
  defaultTransportation: ITransportationOptionFull | null;
  showError: (message: string) => void;
};

export const getServiceTypeOptions = (): TOption[] => {
  return Object.entries(serviceTypeNames).map(([value, name]) => ({ value, name }));
};

export const validateFirstScreenOptionForm = ({
  selectedServiceType,
  orderIndex,
  isPickUpDropOffType,
  defaultTransportation,
  showError,
}: TValidateParams): boolean => {
  let isValid = true;

  if (!selectedServiceType) {
    showError('"Booking Flow Config" is required');
    isValid = false;
  }

  if (!orderIndex) {
    showError('"Order Index" is required');
    isValid = false;
  }

  if (isPickUpDropOffType && !defaultTransportation) {
    showError('Default Transportation Option is required');
    isValid = false;
  }

  return isValid;
};

type TBuildUpdateDataParams = {
  firstScreenOptionName: string;
  description: string;
  note: string;
  selectedServiceType: TOption | null;
  orderIndex: string;
  taglineText: string;
  taglineColor: string;
  externalLink: string;
  defaultTransportation: ITransportationOptionFull | null;
};

export const buildFirstScreenOptionUpdateData = ({
  firstScreenOptionName,
  description,
  note,
  selectedServiceType,
  orderIndex,
  taglineText,
  taglineColor,
  externalLink,
  defaultTransportation,
}: TBuildUpdateDataParams): TUpdateFirstScreenOption => {
  const data: TUpdateFirstScreenOption = {
    name: firstScreenOptionName,
    description,
    note,
    type: selectedServiceType?.value ?? EServiceType.VisitCenter,
    orderIndex: +orderIndex,
    taglineText: taglineText.trim().length ? taglineText.trim() : null,
    taglineFontColorHex: taglineColor.length ? taglineColor : null,
  };

  if (externalLink) {
    data.externalLink = externalLink;
  }

  if (defaultTransportation) {
    data.transportationOptionId = defaultTransportation.id;
  }

  return data;
};

export const buildFirstScreenOptionCreateData = (
  updateData: TUpdateFirstScreenOption,
  serviceCenterId: number
): TNewFirstScreenOption => {
  return {
    ...updateData,
    serviceCenterId,
  };
};

export const getInitialFormState = (editingItem: IFirstScreenOption) => {
  return {
    firstScreenOptionName: editingItem.name,
    orderIndex: editingItem.orderIndex?.toString() ?? '',
    description: editingItem.description ?? '',
    note: editingItem.note ?? '',
    externalLink: editingItem.externalLink ?? '',
    taglineText: editingItem.taglineText ?? '',
    taglineColor: editingItem.taglineFontColorHex ?? '',
  };
};

export const resolveDefaultTransportationForEdit = (
  editingItem: IFirstScreenOption,
  options: ITransportationOptionFull[]
): ITransportationOptionFull | null => {
  if (!editingItem.transportationOption?.id) {
    return null;
  }

  return options.find(item => item.id === editingItem.transportationOption?.id) ?? null;
};

export const shouldClearTransportationOnServiceTypeChange = (
  value: TOption | null,
  defaultTransportation: ITransportationOptionFull | null
): boolean => {
  return Boolean(
    value && defaultTransportation && value.value === EServiceType.MobileService.toString()
  );
};

export const shouldApplyPickupDeliveryDefault = (
  value: TOption | null,
  defaultTransportation: ITransportationOptionFull | null,
  editingItem: IFirstScreenOption | null
): boolean => {
  return Boolean(
    value?.value === EServiceType.PickUpDropOff.toString() &&
    (!defaultTransportation || !editingItem)
  );
};

export const shouldShowPickupDropOffWarning = (
  serviceType: string,
  defaultTransportationType?: ETransportationType
): boolean => {
  return (
    serviceType === String(EServiceType.PickUpDropOff) &&
    defaultTransportationType != null &&
    defaultTransportationType !== ETransportationType.PickUpDelivery
  );
};
