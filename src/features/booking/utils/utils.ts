import { EServiceType } from "../../../store/reducers/appointmentFrameReducer/types";
import { TScreen } from "../../../types/types";
import { ICurrentMenu, TData } from "./types";

export const getCurrentMenu = (
  serviceType: EServiceType,
  advisor: boolean,
  transportation: boolean,
  isManaging: boolean,
): string[] => {
  const menu: ICurrentMenu = {
    yourLocation: "Your Location",
    serviceNeeds: "Service Needs",
    advisorSelection: "Advisor Selection",
    transportationNeeds: "Transportation Needs",
    appointmentSelection: "Appointment Selection",
    appointmentConfirmation: "Appointment Confirmation",
    manageAppointment: "Manage Appointment",
  };
  if (!advisor) delete menu.advisorSelection;
  if (!transportation) delete menu.transportationNeeds;
  if (!isManaging) {
    delete menu.manageAppointment;
  } else {
    delete menu.appointmentConfirmation;
  }
  if (serviceType === EServiceType.VisitCenter) delete menu.yourLocation;
  return Object.values(menu);
};

export const getStepsScreen = (
  serviceType: EServiceType,
  advisorSelection: boolean,
  appointmentSelection: boolean,
  transportationNeeds: boolean,
  isManaging: boolean,
): TScreen[] => {
  const screens: { [key: string]: TScreen } = {
    location: "location",
    serviceNeeds: "serviceNeeds",
    consultantSelection: "consultantSelection",
    transportationNeeds: "transportationNeeds",
    appointmentSelection: appointmentSelection
      ? "appointmentTiming"
      : "appointmentSelection",
    appointmentConfirmation: "appointmentConfirmation",
    manageAppointment: "manageAppointment",
  };
  if (!advisorSelection) delete screens.consultantSelection;
  if (!transportationNeeds) delete screens.transportationNeeds;
  if (!isManaging) {
    delete screens.manageAppointment;
  } else {
    delete screens.appointmentConfirmation;
  }
  if (serviceType === EServiceType.VisitCenter) delete screens.location;
  return Object.values(screens);
};

export const getStepsMap = (
  serviceType: EServiceType,
  isAdvisorAvailable: boolean,
  isAppointmentSelection: boolean,
  isTransportationNeeds: boolean,
): { [K in TScreen]: number } => {
  const data: { [K in TScreen]: number } = {
    carSelection: 0,
    location: 1,
    serviceNeeds: serviceType === EServiceType.VisitCenter ? 1 : 2,
    maintenanceDetails: serviceType === EServiceType.VisitCenter ? 1 : 2,
    packageSelection: serviceType === EServiceType.VisitCenter ? 1 : 2,
    describeMore: serviceType === EServiceType.VisitCenter ? 1 : 2,
    opsCode: serviceType === EServiceType.VisitCenter ? 1 : 2,
    serviceOfferProductPage: serviceType === EServiceType.VisitCenter ? 1 : 2,
    consultantSelection:
      serviceType === EServiceType.VisitCenter
        ? 2
        : serviceType === EServiceType.MobileService
          ? -1
          : 3,
    transportationNeeds: serviceType === EServiceType.VisitCenter ? 3 : -1,
    appointmentTiming:
      serviceType === EServiceType.PickUpDropOff || isTransportationNeeds
        ? 4
        : 3,
    appointmentSelection:
      serviceType === EServiceType.PickUpDropOff || isTransportationNeeds
        ? 4
        : 3,
    appointmentConfirmation: serviceType === EServiceType.MobileService ? 4 : 5,
    manageAppointment: serviceType === EServiceType.MobileService ? 4 : 5,
    appointmentConfirmed: serviceType === EServiceType.MobileService ? 4 : 5,
    payment: 6,
  };
  if (!isAdvisorAvailable && data.consultantSelection > -1) {
    for (let key in data) {
      if (data[key as keyof TData] > data.consultantSelection) {
        data[key as keyof TData] = data[key as keyof TData] - 1;
      }
    }
    data.consultantSelection = -1;
  }
  if (!isAppointmentSelection) {
    data.appointmentTiming = -1;
  }
  if (!isTransportationNeeds && data.transportationNeeds > -1) {
    for (let key in data) {
      if (data[key as keyof TData] > data.transportationNeeds) {
        data[key as keyof TData] = data[key as keyof TData] - 1;
      }
    }
    data.transportationNeeds = -1;
  }
  return data;
};
