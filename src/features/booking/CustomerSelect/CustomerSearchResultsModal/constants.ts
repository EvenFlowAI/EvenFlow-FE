import { TColumn, TSearchColumnName } from './types';

export const customerDataColumns: TColumn[] = [
  {
    name: 'Last Name',
    order: 'lastName',
  },
  {
    name: 'First Name',
    order: 'firstName',
  },
  {
    name: 'Company Name',
  },
  {
    name: 'Home',
    order: 'homePhone',
  },
  {
    name: 'Cell',
    order: 'cellPhone',
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
  {
    name: 'Year',
  },
  {
    name: 'Make',
  },
  {
    name: 'Model',
  },
  {
    name: 'VIN',
    order: 'vin',
  },
];

export const columnsNames: TSearchColumnName[] = customerDataColumns.map(el => el.name);

export const initialColumnOffset = {
  secondColumn: 184,
  thirdColumn: 334,
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
