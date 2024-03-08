import {TForm} from "./types";

export const initialForm: TForm = {
    name: '',
    message: '',
    title: '',
    advisors: [],
    serviceRequests: [],
    isWaitlistEnabled: false,
    makes: [],
    models: [],
    modelYearFrom: null,
    modelYearTo: null,
    customerType: null,
    serviceBooks: [],
    appointmentTimeFrom: '',
    appointmentTimeTo: '',
    daysOfWeek: [],
    transportationOptions: [],
    mobileServiceZones: [],
    serviceValetZones: [],
}