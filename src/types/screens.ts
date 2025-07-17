export type TBaseScreen =
  | 'carSelection'
  | 'serviceNeeds'
  | 'maintenanceDetails'
  | 'packageSelection'
  | 'describeMore'
  | 'opsCode'
  | 'consultantSelection'
  | 'appointmentTiming'
  | 'appointmentSelection'
  | 'transportationNeeds'
  | 'appointmentConfirmed'
  | 'location'
  | 'payment'
  | 'serviceOfferProductPage';

export type TScreen = TBaseScreen | 'appointmentConfirmation' | 'manageAppointment';

export type TMobileScreen =
  | 'carSelection'
  | 'serviceNeeds'
  | 'maintenanceDetails'
  | 'packageSelection'
  | 'describeMore'
  | 'opsCode'
  | 'appointmentTiming'
  | 'appointmentSelection'
  | 'appointmentConfirmation'
  | 'appointmentConfirmed'
  | 'location'
  | 'payment'
  | 'serviceOfferProductPage';
