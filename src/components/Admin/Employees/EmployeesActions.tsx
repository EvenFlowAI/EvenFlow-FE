import React, {Dispatch, SetStateAction, useCallback} from "react";
import {Button, styled} from "@material-ui/core";
import {useCurrentUser, useModal} from "../../../utils/hooks";
import {CreateEmployee} from "../../Modals/CreateEmployee/CreateEmployee";
import {SearchDB} from "../../UI/SearchInput";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {setEmplSearch} from "../../../store/reducers/employees/actions";

const ActionsWrapper = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: "flex-end",
    '& > button': {
        marginLeft: 20,
    }
})

type TEmployeesActions = {
    setFiltersOpen: Dispatch<SetStateAction<boolean>>
}

export const EmployeesActions: React.FC<TEmployeesActions> = ({setFiltersOpen}) => {
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
