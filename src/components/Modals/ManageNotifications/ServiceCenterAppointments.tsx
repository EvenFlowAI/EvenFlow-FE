import React, {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {TChangesState, useNotificationStyles} from "./ManageNotifications";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Button, Divider, IconButton, Switch} from "@material-ui/core";
import {DialogActions} from "../BaseModal";
import {ReactComponent as PlusIcon} from "../../../assets/img/plus.svg";
import {ReactComponent as DeleteIcon} from "../../../assets/img/close.svg";
import {ENotificationType, TSCNotifications} from "../../../store/reducers/notifications/types";
import {updateNotificationsByType} from "../../../store/reducers/notifications/actions";
import {useSCs} from "../../../utils/hooks";
import {IAdvisorShort} from "../../../store/reducers/users/types";

export const initialSCNotifications: TSCNotifications = {
    isActive: false,
    employees: []
}

export type TNotificatonsProps = {setChangesState: Dispatch<SetStateAction<TChangesState>>, changesState?: TChangesState}

const ServiceCenterAppointments: React.FC<TNotificatonsProps> = ({setChangesState}) => {
    const {usersShort, loading} = useSelector((state: RootState) => state.employees);
    const {scNotifications, isLoading} = useSelector((state: RootState) => state.notifications);
    const [currentEmployee, setCurrentEmployee] = useState<IAdvisorShort|null>(null);
    const [scData, setScData] = useState<TSCNotifications|null>(initialSCNotifications);
    const [selectedEmployees, setSelectedEmployees] = useState<IAdvisorShort[]>([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useNotificationStyles();

    useEffect(() => {
        let changesAreSaved = true;
        if (scNotifications || scData) {
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
        setChangesState(prevState => ({...prevState, scNotificationsSaved: changesAreSaved}))
    }, [scData, scNotifications])

    useEffect(() => {
        setScData(scNotifications)
    }, [scNotifications])

    useEffect(() => {
        const selected = usersShort.filter(el => scData?.employees?.includes(el.id))
        setSelectedEmployees(selected)
    }, [usersShort, scData])

    const onEmployeeChange = (e: ChangeEvent<{}>, value: IAdvisorShort|null) => {
        setCurrentEmployee(value)
    }

    const onCancel = () => {
        setScData(scNotifications);
    }

    const onSave = () => {
        if (selectedSC && scData) dispatch(updateNotificationsByType(selectedSC.id, {...scData, notificationType: ENotificationType.ServiceCenter}))
    }

    const handleSwitch = () => {
        setScData(prevState => {
            const data: TSCNotifications|null = {...prevState} ?? {}
            return {...data, isActive: data ? !data.isActive : true}
        })
    }

    const onAddEmployee = () => {
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
                        options={usersShort}
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