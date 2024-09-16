import {
    EAdvisorAssignMethod,
    EAssignmentLevel,
    IEmployeeAssignmentSetting
} from "../../../store/reducers/employees/types";
import {TRole} from "../../../store/reducers/users/types";
import {TOption} from "../ServiceBookModal/types";

export const sortServiceBooks = (a: IEmployeeAssignmentSetting, b: IEmployeeAssignmentSetting) => {
    return a.serviceBookId && b.serviceBookId
        ? a.serviceBookId - b.serviceBookId
        : a.serviceBookId && !b.serviceBookId
            ? -1
            : b.serviceBookId && !a.serviceBookId
                ? 1
                : 0
}

export const getOptionsByRole = (options: TOption[], role: TRole): TOption[] => {
    return options.map(item => item.value as EAdvisorAssignMethod === EAdvisorAssignMethod.LastEmployee
        ? {...item, name: `Last ${role}`}
        : item)
}

export const getMethods = (item: IEmployeeAssignmentSetting|null) => {
    if (item) {
        const advisorPrimaryMethod = item.employeeAssignmentSettings
            .find(el => el.role === 'Advisor')?.methods?.find(el => el.level === EAssignmentLevel.Primary)?.type;
        const technicianPrimaryMethod = item.employeeAssignmentSettings
            .find(el => el.role === 'Technician')?.methods?.find(el => el.level === EAssignmentLevel.Primary)?.type;
        const advisorSecondaryMethod = item.employeeAssignmentSettings
            .find(el => el.role === 'Advisor')?.methods?.find(el => el.level === EAssignmentLevel.Secondary)?.type;
        const technicianSecondaryMethod = item.employeeAssignmentSettings
            .find(el => el.role === 'Technician')?.methods?.find(el => el.level === EAssignmentLevel.Secondary)?.type;
        return {advisorPrimaryMethod, technicianPrimaryMethod, advisorSecondaryMethod, technicianSecondaryMethod}
    } else return {}
}