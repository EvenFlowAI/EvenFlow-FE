import { EServiceType } from '../../../../store/reducers/appointmentFrameReducer/types';
import {
  EServiceCategoryType,
  TUpdateCategoryData,
} from '../../../../store/reducers/categories/types';
import { CategoryFormState, EOrderError, TOption } from './types';
import {
  IAssignedServiceRequest,
  TOPsCodeWithIndex,
} from '../../../../store/reducers/serviceRequests/types';
import { TServiceTypeSettings } from '../../../../store/reducers/bookingFlowConfig/types';
import React from 'react';

export const getPageOptions = (serviceType: EServiceType): TOption[] => {
  const typeName = serviceType === EServiceType.MobileService ? 'Mobile Service' : 'Visit Center';
  return [
    { name: `Owned By ${typeName} (Page 1)`, value: 0 },
    { name: `Owned By ${typeName} (Page 2)`, value: 1 },
  ];
};

export const categoryOptions = Object.keys(EServiceCategoryType)
  .filter(item => Number.isNaN(+item))
  // @ts-ignore
  .map(item => ({ name: item, value: EServiceCategoryType[item] }));

export const getOptionLabel = (option: TOption) => {
  const array = [];
  for (let i = 0; i < option.name.length; i++) {
    if (option.name[i] === option.name[i].toUpperCase() && i > 0) {
      array.push(' ');
    }
    array.push(option.name[i]);
  }
  return array.join('');
};

export const findMissingNumbers = (
  numbers: number[],
  max?: number
): { wrongNumbers: number[]; errors: EOrderError[] } => {
  const missed: number[] = [];
  const errors: EOrderError[] = [];
  const sorted = numbers.sort((a, b) => a - b);
  sorted.forEach((number, index) => {
    if (numbers.filter(el => el === number).length > 1) {
      missed.push(number);
      errors.push(EOrderError.SameNumber);
    }
    if (number > 1 && number - numbers[index - 1] !== 1) {
      missed.push(number);
      errors.push(EOrderError.MissingNumber);
    }
    if (max && number > max) {
      missed.push(number);
      errors.push(EOrderError.MissingNumber);
    }
  });
  return { wrongNumbers: Array.from(new Set(missed)), errors };
};

export function updateCodesWithOrder(
  prev: TOPsCodeWithIndex[],
  serviceRequest: IAssignedServiceRequest
): TOPsCodeWithIndex[] {
  const codeToChange = prev.find(item => item.id === serviceRequest.id);
  if (!codeToChange) {
    return prev;
  }

  if (codeToChange.orderIndex) {
    const updated = prev.map(code => ({
      ...code,
      orderIndex:
        +code.orderIndex > +codeToChange.orderIndex ? `${+code.orderIndex - 1}` : code.orderIndex,
    }));
    return updated.filter(item => item.id !== serviceRequest.id);
  }

  return prev.filter(item => item.id !== serviceRequest.id);
}

export function validateCategoryType(
  form: CategoryFormState,
  visitCenterConfig: TServiceTypeSettings | undefined,
  showError: (msg: string) => void
): boolean {
  if (
    form.categoryType?.value === EServiceCategoryType.ValueService &&
    !visitCenterConfig?.valueService
  ) {
    showError('Value Service Option is turned off in the Booking Flow and cannot be saved');
    return false;
  }

  if (form.definedPage?.value === 1) {
    if (form.categoryType?.value === EServiceCategoryType.MaintenancePackage) {
      showError(
        'The Category with link to "Maintenance Package" can`t be saved for "Owned By Booking Flow (Page 2)"'
      );
      return false;
    }
    if (form.categoryType?.value === EServiceCategoryType.LinkToPage2) {
      showError(
        'The Category with link to "Link to Page 2" can`t be saved for "Owned By Booking Flow (Page 2)"'
      );
      return false;
    }
  }

  return true;
}

export function buildCategoryData(
  form: CategoryFormState,
  categoryHasCodesOrder: boolean,
  setForm: React.Dispatch<React.SetStateAction<CategoryFormState>>,
  showError: (msg: string) => void
): TUpdateCategoryData | null {
  if (!(form.categoryName && form.definedPage && form.categoryType && form.orderIndex)) {
    return null;
  }

  const data: TUpdateCategoryData = {
    name: form.categoryName,
    page: form.definedPage.value,
    type: form.categoryType.value,
    serviceRequests: [],
    orderIndex: Number(form.orderIndex),
    isCommentRequired:
      form.categoryType.value === EServiceCategoryType.GeneralCategory
        ? form.isCommentRequired
        : false,
    serviceType: form.selectedServiceType,
  };

  if (form.description) data.description = form.description;

  if (form.categoryType.value === EServiceCategoryType.GeneralCategory) {
    if (!form.selectedCodes.length) {
      showError('Please choose service requests for category');
      return null;
    }
    data.serviceRequests = form.selectedCodes.map(({ id }) => ({ id }));
  } else if (categoryHasCodesOrder) {
    if (!form.selectedCodesWithOrder.length) {
      showError('Please choose service requests for category');
      return null;
    }
    if (form.selectedCodesWithOrder.every(el => el.orderIndex !== '')) {
      data.serviceRequests = form.selectedCodesWithOrder.map(el => ({
        ...el,
        orderIndex: +el.orderIndex,
      }));
    } else {
      setForm(prev => ({
        ...prev,
        wrongOrderIndexes: prev.selectedCodesWithOrder.map(el => el.id),
      }));
      return null;
    }
  }

  return data;
}
