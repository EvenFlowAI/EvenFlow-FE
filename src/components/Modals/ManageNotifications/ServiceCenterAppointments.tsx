import React, {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {TChangesState, useNotificationStyles} from "./ManageNotifications";
import {IEmployee} from "../../../store/reducers/employees/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Button, Divider, IconButton, Switch} from "@material-ui/core";
import {DialogActions} from "../BaseModal";
import {ReactComponent as PlusIcon} from "../../../assets/img/plus.svg";
import {ReactComponent as DeleteIcon} from "../../../assets/img/close.svg";
import {TSCNotifications} from "../../../store/reducers/notifications/types";
import {updateNotificationsByType} from "../../../store/reducers/notifications/actions";
import {useSCs} from "../../../utils/hooks";

export const initialSCNotifications: TSCNotifications = {
    isActive: false,
    employeeIds: []
}

export type TNotificatonsProps = {setChangesState: Dispatch<SetStateAction<TChangesState>>}

const ServiceCenterAppointments: React.FC<TNotificatonsProps> = ({setChangesState}) => {
    const {employeesList, loading} = useSelector((state: RootState) => state.employees);
    const {scNotifications, isLoading} = useSelector((state: RootState) => state.notifications);
    const [currentEmployee, setCurrentEmployee] = useState<IEmployee|null>(null);
    const [scData, setScData] = useState<TSCNotifications>(initialSCNotifications);
    const [selectedEmployees, setSelectedEmployees] = useState<IEmployee[]>([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useNotificationStyles();

    useEffect(() => {
        let changesAreSaved = true;
        const employeesListIsDifferent = scNotifications?.employeeIds?.find(el => !scData.employeeIds.includes(el))
            || scData.employeeIds.find(el => !scNotifications?.employeeIds?.includes(el))
        if (scData.isActive !== scNotifications?.isActive) {
            changesAreSaved = false;
        } else if (scData.employeeIds.length && !scNotifications?.employeeIds?.length) {
            changesAreSaved = false;
        } else if (employeesListIsDifferent) {
            changesAreSaved = false;
        }
        setChangesState(prevState => ({...prevState, scNotificationsSaved: changesAreSaved}))
    }, [scData, scNotifications])

    useEffect(() => {
        setScData(scNotifications ?? initialSCNotifications)
    }, [scNotifications])

    useEffect(() => {
        const selected = employeesList.filter(el => scData?.employeeIds.includes(el.id))
        setSelectedEmployees(selected)
    }, [employeesList, scData])

    const onEmployeeChange = (e: ChangeEvent<{}>, value: IEmployee|null) => {
        setCurrentEmployee(value)
    }

    const onCancel = () => {
        setScData(scNotifications ?? initialSCNotifications);
    }

    const onSave = () => {
        if (selectedSC) dispatch(updateNotificationsByType(selectedSC.id, scData))
    }

    const handleSwitch = () => {
        setScData(prevState => ({...prevState, isActive: !prevState.isActive}))
    }

    const onAddEmployee = () => {
        if (currentEmployee) {
            setScData(prevState => ({...prevState, employeeIds: Array.from(new Set([...prevState.employeeIds, currentEmployee.id]))}))
            setCurrentEmployee(null)
        }
    }

    const deleteEmployee = (id: string) => {
        setScData(prevState => ({...prevState, employeeIds: prevState.employeeIds.filter(el => el !== id)}))
    }

    return (
        <div>
            <div className={classes.tabWrapper}>
                <div className={classes.tabTitle}>Service Center Appointments</div>
                <div className={classes.switcherWrapper}>
                    <p className={classes.notificationsLabel}>on/off Service center appointments notifications</p>
                    <Switch
                        onChange={handleSwitch}
                        disabled={loading || isLoading}
                        checked={scData?.isActive}
                        color="primary"
                    />
                </div>
                <div className={classes.selectWrapper}>
                    <Autocomplete
                        options={employeesList}
                        style={{width: 290}}
                        disabled={loading || isLoading}
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
                        disabled={loading || isLoading}
                        className={classes.addButton}
                    >  Add</Button>
                </div>
                <div>
                    {selectedEmployees.sort((a, b) => a.fullName.localeCompare(b.fullName)).map(item => (
                        <div className={classes.employeeWrapper}>
                            <div>{item.fullName}</div>
                            <div>{item.email}</div>
                            <IconButton onClick={() => deleteEmployee(item.id)} disabled={loading || isLoading}><DeleteIcon/></IconButton>
                        </div>
                    ))}
                </div>
            </div>
            <Divider style={{margin: '24px 0'}}/>
            <DialogActions style={{padding: '0 24px 0 0'}}>
                <Button onClick={onCancel} variant="outlined" color="primary" disabled={loading || isLoading}>
                    Cancel
                </Button>
                <Button onClick={onSave} variant="contained" color="primary" disabled={loading || isLoading}>
                    Save
                </Button>
            </DialogActions>
        </div>
    );
};

export default ServiceCenterAppointments;