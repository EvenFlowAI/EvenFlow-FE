import React, {ChangeEvent, useEffect, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../../../utils/AutocompleteRender";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {Button, Divider, IconButton, Switch} from "@material-ui/core";
import {ReactComponent as PlusIcon} from "../../../../../assets/img/plus.svg";
import {ReactComponent as DeleteIcon} from "../../../../../assets/img/close.svg";
import {DialogActions} from "../../../../BaseModal/BaseModal";
import {ENotificationType, TSCNotifications} from "../../../../../store/reducers/notifications/types";
import {TNotificatonsProps} from "../types";
import {initialSCNotifications} from "../constants";
import {useException, useMessage, useSCs} from "../../../../../utils/hooks";
import {updateNotificationsByType} from "../../../../../store/reducers/notifications/actions";
import {IAdvisorShort} from "../../../../../store/reducers/users/types";
import {useNotificationStyles} from "../../../../../commonStyles/useNotificationStyles";

const RecallAppointments: React.FC<TNotificatonsProps> = ({setChangesState}) => {
    const {usersShort, loading} = useSelector((state: RootState) => state.employees);
    const {recallNotifications, isLoading} = useSelector((state: RootState) => state.notifications);
    const [currentEmployee, setCurrentEmployee] = useState<IAdvisorShort|null>(null);
    const [recallData, setRecallData] = useState<TSCNotifications|null>(initialSCNotifications);
    const [selectedEmployees, setSelectedEmployees] = useState<IAdvisorShort[]>([]);
    const [formChecked, setFormChecked] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useNotificationStyles();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        let changesAreSaved = true;
        if (recallNotifications || recallData) {
            if (currentEmployee) {
                changesAreSaved = false;
            } else {
                const employeesListIsDifferent = recallNotifications?.employees?.find(el => !recallData?.employees?.includes(el))
                    || recallData?.employees?.find(el => !recallNotifications?.employees?.includes(el))
                if (Boolean(recallData?.isActive) !== Boolean(recallNotifications?.isActive)) {
                    changesAreSaved = false;
                } else if (recallData?.employees?.length !== recallNotifications?.employees?.length) {
                    changesAreSaved = false;
                } else if (employeesListIsDifferent) {
                    changesAreSaved = false;
                }
            }
        }
        setChangesState(prevState => ({...prevState, recallNotificationsSaved: changesAreSaved}))
    }, [recallData, recallNotifications, currentEmployee])

    useEffect(() => {
        setRecallData(recallNotifications)
    }, [recallNotifications])

    useEffect(() => {
        const selected = usersShort.filter(el => recallData?.employees?.includes(el.id))
        setSelectedEmployees(selected)
    }, [usersShort, recallData])

    const onEmployeeChange = (e: ChangeEvent<{}>, value: IAdvisorShort|null) => {
        setCurrentEmployee(value)
        setFormChecked(false)
    }

    const onCancel = () => {
        setRecallData(recallNotifications)
        setCurrentEmployee(null);
        setFormChecked(false)
    }

    const onSuccess = () => {
        showMessage("Notifications for Recall Appointments updated")
        setCurrentEmployee(null);
        setFormChecked(false)
    }

    const onSave = () => {
        setFormChecked(true)
        if (currentEmployee && !recallData?.employees?.includes(currentEmployee.id)) {
            showError("Please add or remove Selected Employee")
        } else {
            if (selectedSC && recallData) dispatch(updateNotificationsByType(
                selectedSC.id,
                {...recallData, notificationType: ENotificationType.Recalls},
                onSuccess,
                showError))
        }
    }

    const handleSwitch = () => {
        setFormChecked(false)
        setRecallData(prevState => {
            const data: TSCNotifications|null = {...prevState} ?? {}
            return {...data, isActive: data ? !data.isActive : true}
        })
    }

    const onAddEmployee = () => {
        setFormChecked(false)
        if (currentEmployee) {
            setRecallData(prevState => {
                const data: TSCNotifications|null = {...prevState} ?? {}
                return {...data, employees: data?.employees
                        ? Array.from(new Set([...data.employees, currentEmployee.id]))
                        : [currentEmployee.id]
                }
            })
            setCurrentEmployee(null)
        }
    }

    const deleteEmployee = (id: string) => {
        setFormChecked(false)
        setRecallData(prevState => {
            if (prevState) {
                return {...prevState, employees: prevState?.employees ? prevState?.employees.filter(el => el !== id) : []}
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
                    <p className={classes.notificationsLabel}>on/off Recall notifications</p>
                    <Switch
                        onChange={handleSwitch}
                        disabled={loading || isLoading}
                        checked={recallData?.isActive}
                        color="primary"
                    />
                </div>
                <div className={classes.selectWrapper}>
                <Autocomplete
                    options={usersShort}
                    fullWidth
                    disabled={loading || isLoading}
                    getOptionLabel={i => i.fullName}
                    value={currentEmployee}
                    onChange={onEmployeeChange}
                    renderInput={autocompleteRender({
                        label: "Assign Employee",
                        placeholder: 'Select',
                        error: Boolean(currentEmployee && !recallData?.employees?.includes(currentEmployee.id) && formChecked)
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
                        <div className={classes.employeeWrapper} key={item.id}>
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