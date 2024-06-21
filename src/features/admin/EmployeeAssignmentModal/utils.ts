import {EAdvisorAssignMethod, IEmployeeAssignmentSetting} from "../../../store/reducers/employees/types";
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