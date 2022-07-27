import React, {useState} from 'react';
import {Button, MenuItem, Select, styled} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {TextField} from "../../UI/TextField";
import {loadByFilters, loadAll} from "../../../store/reducers/employees/actions";

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

const EmployeesFilters = () => {
    const {fullSCList} = useSelector((state: RootState) => state.serviceCenters);
    const [selectedRole, setSelectedRole] = useState<string|unknown>('');
    const [selectedCenterId, setSelectedCenterId] = useState<number|null>(null);
    const dispatch = useDispatch();

    const handleSelectRole = (e: React.ChangeEvent<{value: unknown}>) => {
        setSelectedRole(e.target.value);
    }

    const handleSelectCenter = (e: React.ChangeEvent<{value: unknown}>) => {
        const center = fullSCList.find(el => el.id === e.target.value);
        if (center) {
            setSelectedCenterId(center?.id);
        } else {
            setSelectedCenterId(null)
        }
    }

    const clearFilters = () => {
        setSelectedCenterId(null);
        setSelectedRole(null);
        dispatch(loadAll());
    }

    const applyFilters = () => {
        dispatch(loadByFilters(selectedRole, selectedCenterId))
    }

    return (
        <>
            <FiltersWrapper>
                <Select
                    fullWidth
                    style={{ marginRight: 20}}
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
                <Select
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
                        return <MenuItem key={serviceCenter.name} value={serviceCenter.id}>{serviceCenter.name}</MenuItem>
                    })}
                </Select>
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