import React, {useEffect, useState} from 'react';
import {Button, MenuItem, Select, styled} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {TextField} from "../../UI/TextField";
import {
    loadByFilters,
    loadAll,
    setEmployeeFilters,
    changePageData
} from "../../../store/reducers/employees/actions";
import {useCurrentUser, usePagination} from "../../../utils/hooks";

const FiltersWrapper = styled('div')({
    width: '100%',
    display: "flex",
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
    '& > div:first-child': {
        marginRight: 20
    }
});

const ButtonsWrapper = styled('div')({
    width: '100%',
    display: "flex",
    alignItems: 'center',
    justifyContent: 'flex-end',
    '& > button:first-child': {
        marginRight: 20
    }
})

const roles = ['Advisor', 'Technician', 'Call Center Rep', 'Manager', 'Owner'];
const widerRoles = ['Advisor', 'Owner'];

const EmployeesFilters = () => {
    const {fullSCList} = useSelector((state: RootState) => state.serviceCenters);
    const {filters} = useSelector((state: RootState) => state.employees);
    const [selectedRole, setSelectedRole] = useState<string|unknown>('');
    const [selectedCenterId, setSelectedCenterId] = useState<number|unknown>('');
    const currentUser = useCurrentUser();
    const dispatch = useDispatch();
    const {changePage} = usePagination(
        (s: RootState) => s.employees.pageData,
        changePageData
    );

    const applyFilters = () => {
        dispatch(loadByFilters())
    }

    useEffect(() => {
        if (filters.role) setSelectedRole(filters.role)
        if (filters.serviceCenterId) setSelectedCenterId(filters.serviceCenterId)
    }, [filters])

    const handleSelectRole = (e: React.ChangeEvent<{value: unknown}>) => {
        if (typeof e.target.value === 'string') {
            dispatch(setEmployeeFilters({role: e.target.value}))
            changePage(null, 0)
        }
    }

    const handleSelectCenter = (e: React.ChangeEvent<{value: unknown}>) => {
        const center = fullSCList.find(el => el.id === e.target.value);
        if (center) {
            dispatch(setEmployeeFilters({serviceCenterId: center.id}))
        } else {
            dispatch(setEmployeeFilters({serviceCenterId: null}))
            // setSelectedCenterId(null)
        }
        changePage(null, 0)
    }

    const clearFilters = () => {
        dispatch(setEmployeeFilters({serviceCenterId: null}))
        setSelectedCenterId(null);
        dispatch(setEmployeeFilters({role: ''}))
        setSelectedRole(null);
        changePage(null, 0)
        dispatch(loadAll());
    }


    return (
        <>
            <FiltersWrapper>
                <Select
                    fullWidth
                    style={{ marginRight: 20, width: currentUser && !widerRoles.includes(currentUser?.role) ? "45%" : "100%"}}
                    placeholder='Role'
                    onChange={handleSelectRole}
                    value={selectedRole}
                    input={
                        <TextField label='Role'/>
                    }
                >
                    <MenuItem value=''>-</MenuItem>
                    {roles.map(role => {
                        return <MenuItem key={role} value={role}>{role}</MenuItem>
                    })}
                </Select>
                {currentUser && widerRoles.includes(currentUser.role)
                    ? <Select
                    fullWidth
                    placeholder='Service Center'
                    onChange={handleSelectCenter}
                    value={selectedCenterId}
                    input={
                        <TextField label='Service Center'/>
                    }
                >
                    <MenuItem value=''>-</MenuItem>
                    {fullSCList.map(serviceCenter => {
                        return <MenuItem key={serviceCenter.name}
                                         value={serviceCenter.id}>{serviceCenter.name}</MenuItem>
                    })}
                </Select> : <div/>}
            </FiltersWrapper>
            <ButtonsWrapper>
                <Button
                    onClick={clearFilters}
                    variant="outlined"
                    color="primary">
                    Clear
                </Button>
                <Button
                    onClick={applyFilters}
                    variant="contained"
                    color="primary">
                    Apply
                </Button>
            </ButtonsWrapper>
        </>
    );
};

export default EmployeesFilters;