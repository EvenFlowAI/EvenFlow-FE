import {TRole} from "../store/reducers/users/types";
import {Routes} from "./routes";
import {TTitle} from "../types/types";

export enum States {
    AL = "Alabama",
    AK = "Alaska",
    AZ = "Arizona",
    AR = "Arkansas",
    CA = "California",
    CO = "Colorado",
    CT = "Connecticut",
    DE = "Delaware",
    FL = "Florida",
    GA = "Georgia",
    HI = "Hawaii",
    ID = "Idaho",
    IL = "Illinois",
    IN = "Indiana",
    IA = "Iowa",
    KS = "Kansas",
    KY = "Kentucky",
    LA = "Louisiana",
    ME = "Maine",
    MD = "Maryland",
    MA = "Massachusetts",
    MI = "Michigan",
    MN = "Minnesota",
    MS = "Mississippi",
    MO = "Missouri",
    MT = "Montana",
    NE = "Nebraska",
    NV = "Nevada",
    NH = "New Hampshire",
    NJ = "New Jersey",
    NM = "New Mexico",
    NY = "New York",
    NC = "North Carolina",
    ND = "North Dakota",
    OH = "Ohio",
    OK = "Oklahoma",
    OR = "Oregon",
    PA = "Pennsylvania",
    RI = "Rhode Island",
    SC = "South Carolina",
    SD = "South Dakota",
    TN = "Tennessee",
    TX = "Texas",
    UT = "Utah",
    VT = "Vermont",
    VA = "Virginia",
    WA = "Washington",
    WV = "West Virginia",
    WI = "Wisconsin",
    WY = "Wyoming",
}

export const states = Object.values(States);

export const WeekDayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]

export enum Roles {
    Advisor='Advisor',
    Technician='Technician',
    Owner='Owner',
    Manager='Manager',
    ServiceDirector='Service Director'
}

export const userRoles: TRole[] = [
    "Manager", "Advisor", "Call Center Rep"
];

export const widerUserRoles: TRole[] = [
    "Manager", "Advisor", "Call Center Rep", "Service Director"
];

export enum Titles {
    DealershipGroups = "Dealership Groups",
    Employees = "Employees",
    ServiceCenters = "Service Centers",
    Appointments = "Appointments",
    Pricing = "Pricing",
    OperationalSetUp = "Operational Set Up",
    CapacityOptimization = "Capacity Optimization",
    Reporting = "Reporting",
}

export const timeSpanString = "HH:mm:ss";
export const timeString = "h:mm a";

export enum LocalItems {
    selectedSC= "SSCID",
}
export const SC_UNDEFINED = "Service center is not loaded";
export const SOMETHING_WRONG = "Something wrong";
export const VIN_LENGTH = 17;
export const G_CALENDAR_FORMAT = "YYYYMMDDT";
export const calendarDateFormat = "ddd, MMM D";

export const optimizerRoot: TTitle = {
    to: Routes.Optimizer.Base,
    title: "Capacity Optimization"
}

export const bookingFlowRoot: TTitle = {
    to: Routes.BookingFlow.Base,
    title: "Booking Flow"
}

export const pricingRoot: TTitle = {
    to: Routes.Pricing.Base,
    title: "Pricing"
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