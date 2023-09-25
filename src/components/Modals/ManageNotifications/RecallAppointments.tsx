import React, {ChangeEvent, useEffect, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {useNotificationStyles} from "./ManageNotifications";
import {IEmployee} from "../../../store/reducers/employees/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Button, Divider, IconButton, Switch} from "@material-ui/core";
import {ReactComponent as PlusIcon} from "../../../assets/img/plus.svg";
import {ReactComponent as DeleteIcon} from "../../../assets/img/close.svg";
import {DialogActions} from "../BaseModal";
import {TSCNotifications} from "../../../store/reducers/notifications/types";
import {initialSCNotifications, TNotificatonsProps} from "./ServiceCenterAppointments";
import {useSCs} from "../../../utils/hooks";
import {updateNotificationsByType} from "../../../store/reducers/notifications/actions";

const RecallAppointments: React.FC<TNotificatonsProps> = ({setChangesState}) => {
    const {employeesList, loading} = useSelector((state: RootState) => state.employees);
    const {recallNotifications, isLoading} = useSelector((state: RootState) => state.notifications);
    const [currentEmployee, setCurrentEmployee] = useState<IEmployee|null>(null);
    const [recallData, setRecallData] = useState<TSCNotifications|null>(initialSCNotifications);
    const [selectedEmployees, setSelectedEmployees] = useState<IEmployee[]>([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useNotificationStyles();

    useEffect(() => {
        let changesAreSaved = true;
        if (recallNotifications || recallData) {
            const employeesListIsDifferent = recallNotifications?.employeeIds?.find(el => !recallData?.employeeIds?.includes(el))
                || recallData?.employeeIds?.find(el => !recallNotifications?.employeeIds?.includes(el))
            if (Boolean(recallData?.isActive) !== Boolean(recallNotifications?.isActive)) {
                changesAreSaved = false;
            } else if (recallData?.employeeIds?.length !== recallNotifications?.employeeIds?.length) {
                changesAreSaved = false;
            } else if (employeesListIsDifferent) {
                changesAreSaved = false;
            }
        }
        setChangesState(prevState => ({...prevState, recallNotificationsSaved: changesAreSaved}))
    }, [recallData, recallNotifications])

    useEffect(() => {
        setRecallData(recallNotifications)
    }, [recallNotifications])

    useEffect(() => {
        const selected = employeesList.filter(el => recallData?.employeeIds?.includes(el.id))
        setSelectedEmployees(selected)
    }, [employeesList, recallData])

    const onEmployeeChange = (e: ChangeEvent<{}>, value: IEmployee|null) => {
        setCurrentEmployee(value)
    }

    const onCancel = () => {
        setRecallData(recallNotifications)
    }
    const onSave = () => {
        if (selectedSC && recallData) dispatch(updateNotificationsByType(selectedSC.id, recallData))
    }

    const handleSwitch = () => {
        setRecallData(prevState => {
            const data: TSCNotifications|null = {...prevState} ?? {}
            return {...data, isActive: data ? !data.isActive : true}
        })
    }

    const onAddEmployee = () => {
        if (currentEmployee) {
            setRecallData(prevState => {
                const data: TSCNotifications|null = {...prevState} ?? {}
                return {...data, employeeIds: data?.employeeIds
                        ? Array.from(new Set([...data.employeeIds, currentEmployee.id]))
                        : [currentEmployee.id]
                }
            })
            setCurrentEmployee(null)
        }
    }

    const deleteEmployee = (id: string) => {
        setRecallData(prevState => {
            if (prevState) {
                return {...prevState, employeeIds: prevState?.employeeIds ? prevState?.employeeIds.filter(el => el !== id) : []}
            } else {
                return prevState
            }
        })
    }

    return (
        <div>
            <div className={classes.tabWrapper}>
                <div className={classes.tabTitle}>Recall Appointments</div>
                <div className={classes.switcherWrapper}>
                    <p className={classes.notificationsLabel}>on/off Recall appointments notifications</p>
                    <Switch
                        onChange={handleSwitch}
                        disabled={loading || isLoading}
                        checked={recallData?.isActive}
                        color="primary"
                    />
                </div>
                <div className={classes.selectWrapper}>
                <Autocomplete
                    options={employeesList}
                    fullWidth
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

export default RecallAppointments;