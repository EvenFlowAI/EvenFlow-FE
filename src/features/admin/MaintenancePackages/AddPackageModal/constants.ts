import { getYearOptions } from '../../../../utils/getDate';
import { ECustomerCriteria } from '../../../../api/types';

export const criteriaOptions = Object.keys(ECustomerCriteria).filter(key => Number.isNaN(+key));
export const yearOptions = getYearOptions();
export const initialValues = {
  mileageFrom: '',
  mileageTo: '',
  yearFrom: '',
  yearTo: '',
  customerCriteria: ECustomerCriteria.Any,
  isApplyBusinessRules: false,
};
