export type TSearchColumnName =
  | "Last Name"
  | "First Name"
  | "Home"
  | "Cell"
  | "Other"
  | "Email"
  | "Address"
  | "City"
  | "State"
  | "ZIP"
  | "Year"
  | "Make"
  | "Model"
  | "VIN"
  | "Company Name";

export type TSortColumn =
  | "lastName"
  | "firstName"
  | "homePhone"
  | "cellPhone"
  | "otherPhone"
  | "email"
  | "vin";

export type TColumn = {
  name: TSearchColumnName;
  order?: TSortColumn;
};

export type TSortOrder = { isAscending: boolean; order: TSortColumn | null };
export type TOffset = { secondColumn: number; thirdColumn: number };
