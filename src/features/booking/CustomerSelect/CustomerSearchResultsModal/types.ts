export type TSearchColumnName =
  | 'First Name'
  | 'Middle Name'
  | 'Last Name'
  | 'Company Name'
  | 'Make'
  | 'Model'
  | 'Year'
  | 'VIN'
  | 'Cell'
  | 'Home'
  | 'Work'
  | 'Other'
  | 'Email'
  | 'Address'
  | 'City'
  | 'State'
  | 'ZIP';

export type TSortColumn =
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'workPhone'
  | 'homePhone'
  | 'cellPhone'
  | 'otherPhone'
  | 'email'
  | 'vin';

export type TColumn = {
  name: TSearchColumnName;
  order?: TSortColumn;
};

export type TSortOrder = { isAscending: boolean; order: TSortColumn | null };
export type TOffset = { secondColumn: number; thirdColumn: number };
