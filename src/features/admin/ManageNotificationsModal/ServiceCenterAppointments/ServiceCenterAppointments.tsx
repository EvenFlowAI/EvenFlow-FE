import React, {ChangeEvent, useEffect, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Button, Divider, IconButton, Switch} from "@material-ui/core";
import {DialogActions} from "../../../../components/modals/BaseModal/BaseModal";
import {ReactComponent as PlusIcon} from "../../../../assets/img/plus.svg";
import {ReactComponent as DeleteIcon} from "../../../../assets/img/close.svg";
import {ENotificationType, TSCNotifications} from "../../../../store/reducers/notifications/types";
import {updateNotificationsByType} from "../../../../store/reducers/notifications/actions";
import {IAdvisorShort} from "../../../../store/reducers/users/types";
import {useNotificationStyles} from "../../../../hooks/styling/useNotificationStyles";
import {TNotificatonsProps} from "../types";
import {initialSCNotifications} from "../constants";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

const ServiceCenterAppointments: React.FC<TNotificatonsProps> = ({setChangesState, onClose}) => {
    const {usersShort, loading} = useSelector((state: RootState) => state.employees);
    const {scNotifications, isLoading} = useSelector((state: RootState) => state.notifications);
    const [currentEmployee, setCurrentEmployee] = useState<IAdvisorShort|null>(null);
    const [scData, setScData] = useState<TSCNotifications|null>(initialSCNotifications);
    const [selectedEmployees, setSelectedEmployees] = useState<IAdvisorShort[]>([]);
    const [formChecked, setFormChecked] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useNotificationStyles();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        let changesAreSaved = true;
        if (scNotifications || scData) {
            if (currentEmployee) {
                changesAreSaved = false
            } else {
                const employeesListIsDifferent = scNotifications?.employees?.find(el => !scData?.employees?.includes(el))
                    || scData?.employees?.find(el => !scNotifications?.employees?.includes(el))
                const listsLengthIsDifferent = Number(scData?.employees?.length) !== Number(scNotifications?.employees?.length)

                if (Boolean(scData?.isActive) !== Boolean(scNotifications?.isActive)) {
                    changesAreSaved = false;
                } else if (listsLengthIsDifferent) {
                    changesAreSaved = false;
                } else if (employeesListIsDifferent) {
                    changesAreSaved = false;
                }
            }
        }
        setChangesState(prevState => ({...prevState, scNotificationsSaved: changesAreSaved}))
    }, [scData, scNotifications, currentEmployee])

    useEffect(() => {
        setScData(scNotifications)
    }, [scNotifications])

    useEffect(() => {
        const selected = usersShort.filter(el => scData?.employees?.includes(el.id))
        setSelectedEmployees(selected)
    }, [usersShort, scData])

    const onEmployeeChange = (e: ChangeEvent<{}>, value: IAdvisorShort|null) => {
        setFormChecked(false)
        setCurrentEmployee(value)
    }

    const onCancel = () => {
        setFormChecked(false)
        setScData(scNotifications);
        setCurrentEmployee(null);
        onClose()
    }

    const onSuccess = () => {
        showMessage("Notifications for Service Center Appointments updated");
        setCurrentEmployee(null);
        setFormChecked(false)
    }

    const onSave = () => {
        setFormChecked(true)
        if (currentEmployee && !scData?.employees?.includes(currentEmployee.id)) {
            showError("Please add or remove Selected Employee")
        } else {
            if (selectedSC && scData) {
                dispatch(updateNotificationsByType(
                    selectedSC.id,
                    {...scData, notificationType: ENotificationType.ServiceCenter},
                    onSuccess,
                    showError
                ))
            }
        }
    }

    const handleSwitch = () => {
        setFormChecked(false)
        setScData(prevState => {
            const data: TSCNotifications|null = {...prevState} ?? {}
            return {...data, isActive: data ? !data.isActive : true}
        })
    }

    const onAddEmployee = () => {
        setFormChecked(false)
        if (currentEmployee) {
            setScData(prevState => {
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
        setScData(prevState => {
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
                <div className={classes.tabTitle}>Service Center Appointments</div>
                <div className={classes.switcherWrapper}>
                    <p className={classes.notificationsLabel}>on/off Service center and PODs notifications</p>
                    <Switch
                        onChange={handleSwitch}
                        disabled={loading || isLoading}
                        checked={scData?.isActive}
                        color="primary"
                    />
                </div>
                <div className={classes.selectWrapper}>
                    <Autocomplete
                        options={usersShort}
                        style={{width: 290}}
                        disabled={loading || isLoading}
                        getOptionLabel={i => i.fullName}
                        value={currentEmployee}
                        onChange={onEmployeeChange}
                        renderInput={autocompleteRender({
                            label: "Assign Employee",
                            placeholder: 'Select',
                            error: Boolean(currentEmployee && !scData?.employees?.includes(currentEmployee?.id) && formChecked)
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

export default ServiceCenterAppointments;