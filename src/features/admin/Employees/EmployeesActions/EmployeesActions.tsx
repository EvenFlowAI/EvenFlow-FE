import React, {Dispatch, SetStateAction, useCallback} from "react";
import {Button} from "@material-ui/core";
import {CreateEmployee} from "../../../../components/modals/admin/CreateEmployee/CreateEmployee";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {setEmplSearch} from "../../../../store/reducers/employees/actions";
import {ActionsWrapper} from "./styles";
import {SearchDB} from "../../../../components/formControls/SearchDebounced/SearchDB";
import {useModal} from "../../../../hooks/useModal/useModal";
import {useCurrentUser} from "../../../../hooks/useCurrentUser/useCurrentUser";

type TActionsProps = {
    setFiltersOpen: Dispatch<SetStateAction<boolean>>
}

export const EmployeesActions: React.FC<TActionsProps> = ({setFiltersOpen}) => {
    const search = useSelector((state: RootState) => state.employees.searchTerm);
    const currentUser = useCurrentUser();
    const dispatch = useDispatch();
    const {isOpen, onClose, onOpen} = useModal();

    const handleSearch = useCallback((s: string) => {
        dispatch(setEmplSearch(s));
    }, [dispatch]);

    return <ActionsWrapper>
        <SearchDB onSearch={handleSearch} search={search} />
        {currentUser && !currentUser.isSuperUser ? <>
            <Button
                onClick={() => setFiltersOpen(prev => !prev)}
                variant="outlined"
                color="primary">
                Filters
            </Button>
            <Button
                onClick={onOpen}
                variant="contained"
                color="primary">
                Add Employee
            </Button>
            <CreateEmployee open={isOpen} onClose={onClose} />
        </> : null}
    </ActionsWrapper>;
}
