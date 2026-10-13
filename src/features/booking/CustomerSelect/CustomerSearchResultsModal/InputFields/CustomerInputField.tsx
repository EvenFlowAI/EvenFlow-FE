import React from 'react';
import {
  ICustomerForTable,
  ICustomerWithPhones,
} from '../../../../../store/reducers/enhancedCustomerSearch/types';
import { CustomerInput } from '../../../../../components/formControls/CustomerInput/CustomerInput';
import { ECustomerProfileType } from '../../../../../api/types';
import { getCustomerProfileType } from '../CustomerSearchTable/helpers';

type TCustomerInputFieldProps = {
  editingElement: ICustomerWithPhones | null;
  isEdit: boolean;
  fieldName: keyof ICustomerForTable;
  customer: ICustomerWithPhones;
  onFieldChange: (
    fieldName: keyof ICustomerForTable
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const CustomerInputField: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TCustomerInputFieldProps>>
> = ({ editingElement, isEdit, onFieldChange, fieldName, customer }) => {
  const companyNameIsDisabled =
    fieldName === 'companyName' &&
    editingElement != null &&
    getCustomerProfileType(editingElement) === ECustomerProfileType.Personal;

  return isEdit &&
    editingElement?.vehicleId === customer.vehicleId &&
    editingElement?.customerId === customer.customerId ? (
    <CustomerInput
      value={editingElement[fieldName] ?? ''}
      onChange={onFieldChange(fieldName)}
      disabled={companyNameIsDisabled}
    />
  ) : (
    <React.Fragment key={fieldName}>{customer[fieldName] ?? ''}</React.Fragment>
  );
};
