import { EServiceType } from '../../../store/reducers/appointmentFrameReducer/types';
import { TScreen } from '../../../types/screens';
import { ICurrentMenu, TData } from './types';

const shiftStepsAfter = (data: { [K in TScreen]: number }, threshold: number): void => {
  for (const key in data) {
    const typedKey = key as keyof TData;
    if (data[typedKey] > threshold) {
      data[typedKey] = data[typedKey] - 1;
    }
  }
};

const disableStep = (data: { [K in TScreen]: number }, step: keyof TData): void => {
  const currentStepValue = data[step];

  if (currentStepValue > -1) {
    shiftStepsAfter(data, currentStepValue);
    data[step] = -1;
  }
};

const getBaseFeatureStep = (serviceType: EServiceType): number =>
  serviceType === EServiceType.VisitCenter ? 1 : 2;

const getConsultantSelectionStep = (serviceType: EServiceType): number => {
  if (serviceType === EServiceType.VisitCenter) {
    return 2;
  }

  if (serviceType === EServiceType.MobileService) {
    return -1;
  }

  return 3;
};

const getTimingAndSelectionStep = (
  serviceType: EServiceType,
  isTransportationNeeds: boolean
): number => (serviceType === EServiceType.PickUpDropOff || isTransportationNeeds ? 4 : 3);

const getFinalConfirmationStep = (serviceType: EServiceType): number =>
  serviceType === EServiceType.MobileService ? 4 : 5;

const createBaseStepsMap = (
  serviceType: EServiceType,
  isTransportationNeeds: boolean
): { [K in TScreen]: number } => {
  const baseFeatureStep = getBaseFeatureStep(serviceType);
  const timingAndSelectionStep = getTimingAndSelectionStep(serviceType, isTransportationNeeds);
  const finalConfirmationStep = getFinalConfirmationStep(serviceType);

  return {
    carSelection: 0,
    location: 1,
    serviceNeeds: baseFeatureStep,
    maintenanceDetails: baseFeatureStep,
    packageSelection: baseFeatureStep,
    describeMore: baseFeatureStep,
    opsCode: baseFeatureStep,
    serviceOfferProductPage: baseFeatureStep,
    consultantSelection: getConsultantSelectionStep(serviceType),
    transportationNeeds: serviceType === EServiceType.VisitCenter ? 3 : -1,
    appointmentTiming: timingAndSelectionStep,
    appointmentSelection: timingAndSelectionStep,
    appointmentConfirmation: finalConfirmationStep,
    manageAppointment: finalConfirmationStep,
    appointmentConfirmed: finalConfirmationStep,
    payment: 6,
  };
};

const applyStepsAvailability = (
  data: { [K in TScreen]: number },
  isAdvisorAvailable: boolean,
  isAppointmentSelection: boolean,
  isTransportationNeeds: boolean
): void => {
  if (!isAdvisorAvailable) {
    disableStep(data, 'consultantSelection');
  }

  if (!isAppointmentSelection) {
    data.appointmentTiming = -1;
  }

  if (!isTransportationNeeds) {
    disableStep(data, 'transportationNeeds');
  }
};

export const getCurrentMenu = (
  serviceType: EServiceType,
  advisor: boolean,
  transportation: boolean,
  isManaging: boolean,
  isPickupDropoffWithoutFirstScreenOption?: boolean
): string[] => {
  const menu: ICurrentMenu = {
    yourLocation: 'Your Location',
    serviceNeeds: 'Service Needs',
    advisorSelection: 'Advisor Selection',
    transportationNeeds: 'Transportation Needs',
    appointmentSelection: 'Appointment Selection',
    appointmentConfirmation: 'Appointment Confirmation',
    manageAppointment: 'Manage Appointment',
  };
  if (!advisor) delete menu.advisorSelection;
  if (!transportation || isPickupDropoffWithoutFirstScreenOption) delete menu.transportationNeeds;
  if (!isManaging) {
    delete menu.manageAppointment;
  } else {
    delete menu.appointmentConfirmation;
  }
  if (serviceType === EServiceType.VisitCenter && !isPickupDropoffWithoutFirstScreenOption) {
    delete menu.yourLocation;
  }
  return Object.values(menu);
};

export const getStepsScreen = (
  serviceType: EServiceType,
  advisorSelection: boolean,
  appointmentSelection: boolean,
  transportationNeeds: boolean,
  isManaging: boolean,
  isPickupDropoffWithoutFirstScreenOption?: boolean
): TScreen[] => {
  const screens: { [key: string]: TScreen } = {
    location: 'location',
    serviceNeeds: 'serviceNeeds',
    consultantSelection: 'consultantSelection',
    transportationNeeds: 'transportationNeeds',
    appointmentSelection: appointmentSelection ? 'appointmentTiming' : 'appointmentSelection',
    appointmentConfirmation: 'appointmentConfirmation',
    manageAppointment: 'manageAppointment',
  };
  if (!advisorSelection) delete screens.consultantSelection;
  if (!transportationNeeds || isPickupDropoffWithoutFirstScreenOption)
    delete screens.transportationNeeds;
  if (!isManaging) {
    delete screens.manageAppointment;
  } else {
    delete screens.appointmentConfirmation;
  }
  if (serviceType === EServiceType.VisitCenter && !isPickupDropoffWithoutFirstScreenOption) {
    delete screens.location;
  }
  return Object.values(screens);
};

export const getStepsMap = (
  serviceType: EServiceType,
  isAdvisorAvailable: boolean,
  isAppointmentSelection: boolean,
  isTransportationNeeds: boolean
): { [K in TScreen]: number } => {
  const data = createBaseStepsMap(serviceType, isTransportationNeeds);
  applyStepsAvailability(data, isAdvisorAvailable, isAppointmentSelection, isTransportationNeeds);

  return data;
};
