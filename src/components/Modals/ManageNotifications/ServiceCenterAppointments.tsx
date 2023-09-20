import React, {ChangeEvent, useEffect, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {initialData, TSCNotifications, useNotificationStyles} from "./ManageNotifications";
import {IEmployee} from "../../../store/reducers/employees/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Button, Divider, IconButton, Switch} from "@material-ui/core";
import {DialogActions} from "../BaseModal";
import {ReactComponent as PlusIcon} from "../../../assets/img/plus.svg";
import {ReactComponent as DeleteIcon} from "../../../assets/img/close.svg";

const ServiceCenterAppointments = () => {
    const {employeesList, loading} = useSelector((state: RootState) => state.employees);
    const [currentEmployee, setCurrentEmployee] = useState<IEmployee|null>(null);
    const [scNotifications, setScNotifications] = useState<TSCNotifications>(initialData);
    const [selectedEmployees, setSelectedEmployees] = useState<IEmployee[]>([]);
    const classes = useNotificationStyles();

    useEffect(() => {
        const selected = employeesList.filter(el => scNotifications.employeeIds.includes(el.id))
        setSelectedEmployees(selected)
    }, [employeesList, scNotifications])

    const onEmployeeChange = (e: ChangeEvent<{}>, value: IEmployee|null) => {
        setCurrentEmployee(value)
    }

    const onCancel = () => {}
    const onSave = () => {}

    const handleSwitch = () => {
        setScNotifications(prevState => ({...prevState, isActive: !prevState.isActive}))
    }

    const onAddEmployee = () => {
        if (currentEmployee) {
            setScNotifications(prevState => ({...prevState, employeeIds: Array.from(new Set([...prevState.employeeIds, currentEmployee.id]))}))
        }
    }

    const deleteEmployee = (id: string) => {
        setScNotifications(prevState => ({...prevState, employeeIds: prevState.employeeIds.filter(el => el !== id)}))
    }

    return (
        <div>
            <div className={classes.tabWrapper}>
                <div className={classes.tabTitle}>Service Center Appointments</div>
                <div className={classes.switcherWrapper}>
                    <p className={classes.notificationsLabel}>on/off Service center appointments notifications</p>
                    <Switch
                        onChange={handleSwitch}
                        disabled={loading}
                        checked={scNotifications.isActive}
                        color="primary"
                    />
                </div>
                <div className={classes.selectWrapper}>
                    <Autocomplete
                        options={employeesList}
                        style={{width: 290}}
                        disabled={loading}
                        getOptionLabel={i => i.fullName}
                        value={currentEmployee}
                        onChange={onEmployeeChange}
                        renderInput={autocompleteRender({
                            label: "Assign Employee",
                            placeholder: 'Select'
                        })}
                    />
                    <Button
                        variant="text"
                        startIcon={<PlusIcon/>}
                        onClick={onAddEmployee}
                        color="primary"
                        disabled={loading}
                        className={classes.addButton}
                    >  Add</Button>
                </div>
                <div>
                    {selectedEmployees.sort((a, b) => a.fullName.localeCompare(b.fullName)).map(item => (
                        <div className={classes.employeeWrapper}>
                            <div>{item.fullName}</div>
                            <div>{item.email}</div>
                            <IconButton onClick={() => deleteEmployee(item.id)} disabled={loading}><DeleteIcon/></IconButton>
                        </div>
                    ))}
                </div>
            </div>
            <Divider/>
            <DialogActions>
                <Button onClick={onCancel} variant="outlined" color="primary" disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={onSave} variant="contained" color="primary" disabled={loading}>
                    Save
                </Button>
            </DialogActions>
        </div>
    );
};

export default ServiceCenterAppointments;