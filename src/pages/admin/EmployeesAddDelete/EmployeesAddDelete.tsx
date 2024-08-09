import React, {useState} from "react";
import {IEmployee} from "../../../store/reducers/employees/types";
import {CreateEmployee} from "../../../components/modals/admin/CreateEmployee/CreateEmployee";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import EmployeesFilters from "../../../features/admin/Employees/EmployeesFilters/EmployeesFilters";
import EmployeesTable from "../../../features/admin/Employees/EmployeesTable/EmployeesTable";
import {useModal} from "../../../hooks/useModal/useModal";
import {employeesRoot} from "../../../utils/constants";
import {useMediaQuery, useTheme} from "@mui/material";

export const EmployeesAddDelete = () => {
    const [editedItem, setEditedItem] = useState<IEmployee|undefined>();
    const {onOpen, isOpen, onClose} = useModal();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("mdl"))

    return <>
        <TitleContainer title={"Add & Delete"} pad={!isMobile} parent={employeesRoot}/>
        <EmployeesFilters/>
        <EmployeesTable editedItem={editedItem} setEditedItem={setEditedItem} onOpen={onOpen} />
        <CreateEmployee open={isOpen} payload={editedItem} onClose={onClose} />
    </>
}