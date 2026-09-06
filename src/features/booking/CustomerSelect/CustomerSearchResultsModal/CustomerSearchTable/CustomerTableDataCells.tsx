import React from 'react';
import { TableCell } from '@mui/material';
import { IAddressData } from '../../../../../api/types';
import {
  ICustomerForTable,
  ICustomerWithPhones,
} from '../../../../../store/reducers/enhancedCustomerSearch/types';
import { AddressInputField } from '../InputFields/AddressInputField';
import { CustomerInputField } from '../InputFields/CustomerInputField';
import { TColumn, TOffset } from '../types';
import { hasColumn } from './helpers';

type TCustomerFieldConfig = {
  key: string;
  name: string;
  fieldName: keyof ICustomerForTable;
  width?: number;
};

type TAddressFieldConfig = {
  key: string;
  name: string;
  fieldName: keyof IAddressData;
  width?: number;
};

type TProps = {
  orderedColumns: TColumn[];
  customer: ICustomerWithPhones;
  editingElement: ICustomerWithPhones | null;
  isEdit: boolean;
  isEditRow: boolean;
  offset: TOffset;
  bodyCellClassName: string;
  stickyCellClassName: string;
  onFieldChange: (
    fieldName: keyof ICustomerForTable
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressChange: (
    fieldName: keyof IAddressData
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const customerFieldConfigs: TCustomerFieldConfig[] = [
  { key: 'companyName', name: 'Company Name', fieldName: 'companyName', width: 150 },
  { key: 'home', name: 'Home', fieldName: 'homePhone', width: 150 },
  { key: 'cell', name: 'Cell', fieldName: 'cellPhone', width: 150 },
  { key: 'otherPhone', name: 'Other', fieldName: 'otherPhone', width: 150 },
  { key: 'email', name: 'Email', fieldName: 'email', width: 150 },
];

const addressFieldConfigs: TAddressFieldConfig[] = [
  { key: 'address', name: 'Address', fieldName: 'address', width: 225 },
  { key: 'city', name: 'City', fieldName: 'city', width: 120 },
  { key: 'state', name: 'State', fieldName: 'state', width: 70 },
  { key: 'zip', name: 'ZIP', fieldName: 'zipCode', width: 70 },
];

const editablePadding = { padding: '12px 0px' };
const readonlyPadding = { padding: '12px 8px' };

const CustomerTableDataCells: React.FC<TProps> = ({
  orderedColumns,
  customer,
  editingElement,
  isEdit,
  isEditRow,
  offset,
  bodyCellClassName,
  stickyCellClassName,
  onFieldChange,
  onAddressChange,
}) => {
  const rowPaddingStyle = isEditRow ? editablePadding : readonlyPadding;

  return (
    <>
      {hasColumn(orderedColumns, 'Last Name') ? (
        <TableCell
          key="last"
          className={stickyCellClassName}
          width={150}
          style={{ left: offset.secondColumn, ...rowPaddingStyle }}
        >
          <CustomerInputField
            editingElement={editingElement}
            customer={customer}
            fieldName="lastName"
            isEdit={isEdit}
            onFieldChange={onFieldChange}
          />
        </TableCell>
      ) : null}

      {hasColumn(orderedColumns, 'First Name') ? (
        <TableCell
          key="first"
          className={stickyCellClassName}
          width={150}
          style={{ left: offset.thirdColumn, ...rowPaddingStyle }}
        >
          <CustomerInputField
            editingElement={editingElement}
            customer={customer}
            fieldName="firstName"
            isEdit={isEdit}
            onFieldChange={onFieldChange}
          />
        </TableCell>
      ) : null}

      {hasColumn(orderedColumns, 'Make') ? (
        <TableCell key="make" className={bodyCellClassName}>
          {customer.make ?? ''}
        </TableCell>
      ) : null}

      {hasColumn(orderedColumns, 'Model') ? (
        <TableCell key="model" className={bodyCellClassName}>
          {customer.model ?? ''}
        </TableCell>
      ) : null}

      {hasColumn(orderedColumns, 'VIN') ? (
        <TableCell key="vin" className={bodyCellClassName}>
          {customer.vin ?? ''}
        </TableCell>
      ) : null}

      {hasColumn(orderedColumns, 'Year') ? (
        <TableCell key="year" className={bodyCellClassName} width={60}>
          {customer.year ?? ''}
        </TableCell>
      ) : null}

      {customerFieldConfigs.map(config =>
        hasColumn(orderedColumns, config.name) ? (
          <TableCell
            key={config.key}
            className={bodyCellClassName}
            width={config.width}
            style={rowPaddingStyle}
          >
            <CustomerInputField
              editingElement={editingElement}
              customer={customer}
              fieldName={config.fieldName}
              isEdit={isEdit}
              onFieldChange={onFieldChange}
            />
          </TableCell>
        ) : null
      )}

      {addressFieldConfigs.map(config =>
        hasColumn(orderedColumns, config.name) ? (
          <TableCell
            key={config.key}
            className={bodyCellClassName}
            width={config.width}
            style={rowPaddingStyle}
          >
            <AddressInputField
              editingElement={editingElement}
              customer={customer}
              fieldName={config.fieldName}
              isEdit={isEdit}
              onFieldChange={onAddressChange}
            />
          </TableCell>
        ) : null
      )}
    </>
  );
};

export default CustomerTableDataCells;
