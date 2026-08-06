import { TColumn, TSearchColumnName } from './types';

export const customerDataColumns: TColumn[] = [
  {
    name: 'First Name',
    order: 'firstName',
  },
  {
    name: 'Middle Name',
    order: 'middleName',
  },
  {
    name: 'Last Name',
    order: 'lastName',
  },
  {
    name: 'Company Name',
  },
  {
    name: 'Make',
  },
  {
    name: 'Model',
  },
  {
    name: 'Year',
  },
  {
    name: 'VIN',
    order: 'vin',
  },
  {
    name: 'Cell',
    order: 'cellPhone',
  },
  {
    name: 'Home',
    order: 'homePhone',
  },
  {
    name: 'Work',
    order: 'workPhone',
  },
  {
    name: 'Other',
    order: 'otherPhone',
  },
  {
    name: 'Email',
    order: 'email',
  },
  {
    name: 'Address',
  },
  {
    name: 'City',
  },
  {
    name: 'State',
  },
  {
    name: 'ZIP',
  },
];

export const columnsNames: TSearchColumnName[] = customerDataColumns.map(el => el.name);

export const initialColumnOffset = {
  secondColumn: 200,
  thirdColumn: 274,
};

export const requiredColumnsNames: TSearchColumnName[] = [
  'Last Name',
  'First Name',
  'Cell',
  'Email',
  'Year',
  'Make',
  'Model',
];
