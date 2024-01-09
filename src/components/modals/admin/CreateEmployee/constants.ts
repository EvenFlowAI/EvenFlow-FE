import {TAdvisorForm, TTechnicianForm} from "./types";

export const initialAdvisorForm: TAdvisorForm = {
    firstName: '', lastName: '', email: '', phoneNumber: '', serviceCenter: null, role: "Manager", position: '',
    showOnBooking: false, dmsId: ''
}
export const initialTechnicianForm: TTechnicianForm = {
    firstName: '', lastName: '', serviceCenter: null, phoneNumber: "",
    hourlyRate: '', overtimeRate: '', email: "", technicianLevel: 1, dmsId: '',
}

export const superRoles = ["Super Admin", "Owner"]