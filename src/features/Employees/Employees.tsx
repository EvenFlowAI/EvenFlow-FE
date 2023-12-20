import React, {useEffect, useState} from "react";
import {IEmployee} from "../../store/reducers/employees/types";
import {useDispatch} from "react-redux";
import {setEmployeeFilters} from "../../store/reducers/employees/actions";
import {
    useModal,
    useSCs
} from "../../utils/hooks";
import {CreateEmployee} from "../../components/Modals/admin/CreateEmployee/CreateEmployee";
import {Titles} from "../../config/constants";
import {TitleContainer} from "../../components/UI/TitleContainer";
import {EmployeesActions} from "./EmployeesActions/EmployeesActions";
import EmployeesFilters from "./EmployeesFilters/EmployeesFilters";
import EmployeesTable from "./EmployeesTable/EmployeesTable";

export const Employees = () => {
    const [editedItem, setEditedItem] = useState<IEmployee|undefined>();
    const [isFiltersOpen, setFiltersOpen] = useState<boolean>(true);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const {onOpen, isOpen, onClose} = useModal();

    useEffect(() => {
        if (selectedSC) {
            dispatch(setEmployeeFilters({serviceCenterId: selectedSC.id}))
        }
    }, [selectedSC])

    return <>
        <TitleContainer title={Titles.Employees} pad actions={<EmployeesActions setFiltersOpen={setFiltersOpen}/>} />
        {isFiltersOpen && <EmployeesFilters/>}
        <EmployeesTable editedItem={editedItem} setEditedItem={setEditedItem} onOpen={onOpen} />
        <CreateEmployee open={isOpen} payload={editedItem} onClose={onClose} />
    </>
}