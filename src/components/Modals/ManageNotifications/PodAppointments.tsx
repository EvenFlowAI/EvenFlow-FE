import React, {ChangeEvent, useEffect, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {useNotificationStyles} from "./ManageNotifications";
import {IEmployee} from "../../../store/reducers/employees/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Button, Divider, IconButton} from "@material-ui/core";
import {DialogActions} from "../BaseModal";
import {IPod} from "../../../store/reducers/pods/types";
import {ReactComponent as PlusIcon} from "../../../assets/img/plus.svg";
import {ReactComponent as DeleteIcon} from "../../../assets/img/close.svg";
import {useSCs} from "../../../utils/hooks";
import {loadPods} from "../../../store/reducers/pods/actions";
import {TPodNotifications} from "../../../store/reducers/notifications/types";

const podInitialNotifications: TPodNotifications = {
    pod: null,
    employeeIds: []
}

const PodAppointments = () => {
    const {employeesList, loading} = useSelector((state: RootState) => state.employees);
    const {podsList, podsLoading} = useSelector((state: RootState) => state.pods);
    const {podNotifications, isLoading} = useSelector((state: RootState) => state.notifications);
    const [currentEmployee, setCurrentEmployee] = useState<IEmployee|null>(null);
    const [podData, setPodData] = useState<TPodNotifications>(podInitialNotifications)
    const [selectedEmployees, setSelectedEmployees] = useState<IEmployee[]>([]);
    const [selectedPod, setSelectedPod] = useState<IPod|null>(null);
    const classes = useNotificationStyles();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    useEffect(() => {
        setPodData(podNotifications ? podNotifications : podInitialNotifications)
    }, [podNotifications])

    useEffect(() => {
        if (selectedSC) dispatch(loadPods(selectedSC?.id))
    }, [selectedSC])

    useEffect(() => {
        const selected = employeesList.filter(el => podData.employeeIds.includes(el.id))
        setSelectedEmployees(selected)
    }, [employeesList, podData])

    const onEmployeeChange = (e: ChangeEvent<{}>, value: IEmployee|null) => {
        setCurrentEmployee(value)
    }

    const onPodChange = (e: ChangeEvent<{}>, value: IPod|null) => {
        setSelectedPod(value)
    }

    const onCancel = () => {}
    const onSave = () => {}

    const onAddEmployee = () => {
        if (currentEmployee) {
            setPodData(prevState => ({...prevState, employeeIds: Array.from(new Set([...prevState.employeeIds, currentEmployee.id]))}))
            setCurrentEmployee(null)
        }
    }

    const deleteEmployee = (id: string) => {
        setPodData(prevState => ({...prevState, employeeIds: prevState.employeeIds.filter(el => el !== id)}))
    }

    return (
        <div>
            <div className={classes.tabWrapper}>
                <div className={classes.tabTitle}>POD Appointments</div>
                <Autocomplete
                    options={podsList}
                    fullWidth
                    disabled={loading || podsLoading || isLoading}
                    getOptionLabel={i => i.name}
                    value={selectedPod}
                    onChange={onPodChange}
                    style={{marginBottom: 24}}
                    renderInput={autocompleteRender({
                        label: '',
                        placeholder: 'Select POD'
                    })}
                />
                <div className={classes.selectWrapper}>
                <Autocomplete
                    options={employeesList}
                    disabled={loading || podsLoading || isLoading}
                    fullWidth
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
                        disabled={loading || podsLoading || isLoading}
                        className={classes.addButton}
                    >  Add</Button>
                </div>
                <div>
                    {selectedEmployees.sort((a, b) => a.fullName.localeCompare(b.fullName)).map(item => (
                        <div className={classes.employeeWrapper}>
                            <div>{item.fullName}</div>
                            <div>{item.email}</div>
                            <IconButton
                                onClick={() => deleteEmployee(item.id)}
                                disabled={loading || podsLoading || isLoading}>
                                <DeleteIcon/>
                            </IconButton>
                        </div>
                    ))}
                </div>
            </div>
            <Divider/>
            <DialogActions>
                <Button onClick={onCancel} variant="outlined" color="primary" disabled={loading || podsLoading || isLoading}>
                    Cancel
                </Button>
                <Button onClick={onSave} variant="contained" color="primary" disabled={loading || podsLoading || isLoading}>
                    Save
                </Button>
            </DialogActions>
        </div>
    );
};

export default PodAppointments;