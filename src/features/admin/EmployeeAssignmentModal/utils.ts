import {IEmployeeAssignmentSetting} from "../../../store/reducers/employees/types";

export const sortServiceBooks = (a: IEmployeeAssignmentSetting, b: IEmployeeAssignmentSetting) => {
    return a.serviceBookId && b.serviceBookId
        ? a.serviceBookId - b.serviceBookId
        : a.serviceBookId && !b.serviceBookId
            ? -1
            : b.serviceBookId && !a.serviceBookId
                ? 1
                : 0
}