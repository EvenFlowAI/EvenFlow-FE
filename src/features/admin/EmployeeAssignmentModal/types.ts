import {EAssignmentLevel, IEmployeeAssignmentSetting} from "../../../store/reducers/employees/types";
import {ChangeEvent, Dispatch, SetStateAction} from "react";
import {TOption} from "../ServiceBookModal/types";

export type TEmployeeAssignmentMobileProps = {
    data: IEmployeeAssignmentSetting[];
    expandedItem: IEmployeeAssignmentSetting | null;
    setExpandedItem: Dispatch<SetStateAction<IEmployeeAssignmentSetting | null>>;
    onMethodChange: (item: IEmployeeAssignmentSetting, level: EAssignmentLevel, role: "Advisor" | "Technician") =>
        (e: ChangeEvent<{}>, value: TOption | null) => void;
}