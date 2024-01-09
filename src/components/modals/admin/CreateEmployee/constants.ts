import {TEmployeeForm} from "./types";

export const initialEmployeeForm: TEmployeeForm = {
    firstName: '', lastName: '', serviceCenter: null, role: null, position: '',
    hourlyRate: '', overtimeRate: '', email: "", technicianLevel: 1, dmsId: '',
}

export const superRoles = ["Super Admin", "Owner"]
