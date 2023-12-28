import React, {useEffect, useState} from "react";
import {IEmployee} from "../../../store/reducers/employees/types";
import {useDispatch} from "react-redux";
import {setEmployeeFilters} from "../../../store/reducers/employees/actions";
import {CreateEmployee} from "../../../components/modals/admin/CreateEmployee/CreateEmployee";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {EmployeesActions} from "../../../features/admin/Employees/EmployeesActions/EmployeesActions";
import EmployeesFilters from "../../../features/admin/Employees/EmployeesFilters/EmployeesFilters";
import EmployeesTable from "../../../features/admin/Employees/EmployeesTable/EmployeesTable";
import {useModal} from "../../../hooks/useModal/useModal";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {Titles} from "../../../types/types";

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