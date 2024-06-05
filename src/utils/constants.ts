import {TRole} from "../store/reducers/users/types";
import {EStates, TTitle} from "../types/types";
import {TGAOptions} from "./types";
import {Routes} from "../routes/constants";

export const states = Object.values(EStates);

export const WeekDayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]

export const userRoles: TRole[] = [
    "Advisor",  "Technician", "Call Center Rep", "Manager",
];

export const widerUserRoles: TRole[] = [
    "Advisor",  "Technician", "Call Center Rep", "Manager", "Service Director",
];

export const timeSpanString = "HH:mm:ss";
export const time12HourSeconds = "hh:mm:ss";
export const time12HourFormat = "h:mm a";
export const dateTimeString = "ddd, MMM D, h:mm A";
export const time24HourFormat = "hh:mm A";
export const hourFormat = "HH:mm";
export const twelveHourFormat = "hh:mm";

export const SC_UNDEFINED = "Service center is not loaded";
export const SOMETHING_WRONG = "Something wrong";
export const G_CALENDAR_FORMAT = "YYYYMMDDT";
export const CALENDAR_FORMAT = "YYYY-MM-DD";
export const calendarDateFormat = "ddd, MMM D";

export const capacityManagementRoot: TTitle = {
    to: Routes.CapacityManagement.Base,
    title: "Capacity Management"
}

export const servicesRoot: TTitle = {
    to: Routes.Services.Base,
    title: "Services"
}

export const bookingFlowRoot: TTitle = {
    to: Routes.BookingFlow.Base,
    title: "Booking Flow"
}

export const pricingRoot: TTitle = {
    to: Routes.Pricing.Base,
    title: "Dynamic Pricing"
}

export const employeesRoot: TTitle = {
    to: Routes.Employees.Base,
    title: "Employees"
}

export const centerProfileRoot: TTitle = {
    to: Routes.CenterProfile.Base,
    title: "Center Profile"
}

export const SCREENS = {
    carSelection: 'Car Selection',
    serviceNeeds: 'Service Needs',
    packageSelection: 'Package Selection',
    maintenanceDetails: 'Car Details',
    carDetails: 'Car Details',
    consultantSelection: 'Consultant Selection',
    serviceSelection: 'Service Selection',
    describeMore: 'Describe More',
    appointmentConfirmation: 'Appointment Confirmation',
    appointmentSelection: 'Appointment Selection',
    appointmentConfirmed: 'Appointment Confirmed',
    appointmentTiming: 'Appointment Timing',
    transportationNeeds: 'Transportation Needs',
    opsCode: "opsCode",
    vehicleData: "vehicleData",
    location: "Your Location",
    payment: "payment",
    serviceOfferProductPage: "Service Offer Produce Page",
    manageAppointment: "Manage Appointment",
}
export const options: TGAOptions = {
    siteSpeedSampleRate: 100,
    cookieDomain: 'auto',
    allowLinker: true,
    storage: 'none',
}