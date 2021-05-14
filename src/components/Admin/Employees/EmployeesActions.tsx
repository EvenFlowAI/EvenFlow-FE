import React, {useCallback} from "react";
import {Button} from "@material-ui/core";
import {useCurrentUser, useModal} from "../../../utils/hooks";
import {CreateEmployee} from "../../Modals/CreateEmployee/CreateEmployee";
import {SearchDB} from "../../UI/SearchInput";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {setEmplSearch} from "../../../store/reducers/employees/actions";


export const EmployeesActions = () => {
    const currentUser = useCurrentUser();
    const {isOpen, onClose, onOpen} = useModal();
    const dispatch = useDispatch();
    const search = useSelector((state: RootState) => state.employees.searchTerm);

    const handleSearch = useCallback((s: string) => {
        dispatch(setEmplSearch(s));
    }, [dispatch]);

    return <>
        <SearchDB onSearch={handleSearch} search={search} />
        {currentUser && !currentUser.isSuperUser ? <>
            <Button
                onClick={onOpen}
                variant="contained"
                color="primary">
                New Employee
            </Button>
            <CreateEmployee open={isOpen} onClose={onClose} />
        </> : null}
    </>;
}
