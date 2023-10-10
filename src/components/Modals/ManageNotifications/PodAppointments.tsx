import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {useNotificationStyles} from "./ManageNotifications";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Button, Divider, IconButton} from "@material-ui/core";
import {DialogActions} from "../BaseModal";
import {IPodShort} from "../../../store/reducers/pods/types";
import {ReactComponent as PlusIcon} from "../../../assets/img/plus.svg";
import {ReactComponent as DeleteIcon} from "../../../assets/img/close.svg";
import {useConfirm, useException, useMessage, useSCs} from "../../../utils/hooks";
import {loadPodsShort} from "../../../store/reducers/pods/actions";
import {TNotifications} from "../../../store/reducers/notifications/types";
import {setLoading, updatePodNotifications} from "../../../store/reducers/notifications/actions";
import {TNotificatonsProps} from "./ServiceCenterAppointments";
import {Loading} from "../../UI/Loading";
import {checkPodsAreTheSame} from "./utils";
import {IAdvisorShort} from "../../../store/reducers/users/types";

const PodAppointments: React.FC<TNotificatonsProps> = ({setChangesState, changesState}) => {
    const {usersShort, loading} = useSelector((state: RootState) => state.employees);
    const {shortPodsList, podsLoading} = useSelector((state: RootState) => state.pods);
    const {podNotifications, isLoading} = useSelector((state: RootState) => state.notifications);
    const [currentEmployee, setCurrentEmployee] = useState<IAdvisorShort|null>(null);
    const [allPodData, setAllPodData] = useState<TNotifications[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<IAdvisorShort[]>([]);
    const [selectedPod, setSelectedPod] = useState<IPodShort|null>(null);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const {askConfirm} = useConfirm();
    const showError = useException();
    const showMessage = useMessage();
    const classes = useNotificationStyles();
    const currentPodData = useMemo(() => allPodData.find(el => el.id === selectedPod?.id), [allPodData, selectedPod])

    useEffect(() => {
        const changesSaved = checkPodsAreTheSame(allPodData, podNotifications)
        setChangesState(prevState => ({...prevState, podNotificationsSaved: changesSaved}))
    }, [allPodData, podNotifications])

    useEffect(() => {
        setAllPodData(podNotifications)
    }, [podNotifications])

    useEffect(() => {
        if (selectedSC) dispatch(loadPodsShort(selectedSC?.id))
    }, [selectedSC])

    useEffect(() => {
        dispatch(setLoading(true))
        if (podNotifications.length) {
            const pod = shortPodsList.find(el => el.id === podNotifications[0].id)
            pod && setSelectedPod(pod)
        }
        dispatch(setLoading(false))
    }, [podNotifications, shortPodsList])

    useEffect(() => {
        if (currentPodData?.usersList) {
            const selected = usersShort.filter(el => currentPodData?.usersList?.includes(el.id))
            setSelectedEmployees(selected)
        }
    }, [usersShort, currentPodData])

    const onEmployeeChange = (e: ChangeEvent<{}>, value: IAdvisorShort|null) => {
        setCurrentEmployee(value)
    }

    const onPodChange = (e: ChangeEvent<{}>, value: IPodShort|null) => {
        const podData = allPodData.find(el => el.id === value?.id);
        if (podData) {
            const selected = usersShort.filter(el => podData.usersList?.includes(el.id))
            setSelectedEmployees(selected)
        } else {
            if (value) {
                setAllPodData(prevState => ([...prevState, {id: value?.id, usersList: []}]))
            } else {
                setAllPodData(prevState => prevState.filter(item => item.id !== selectedPod?.id))
            }
            setSelectedEmployees([])
        }
        setSelectedPod(value)
    }

    const onCancel = () => {
        if (changesState?.podNotificationsSaved) {
            setAllPodData(podNotifications)
        } else {
            askConfirm({
                isRemove: true,
                confirmContent: "Cancel changes",
                cancelContent: "Save changes",
                title: "Cancel Pod Notifications changes",
                content: <span>
                       By clicking Cancel, your entries across all Pods will not be saved.<br />
                     Click Save Changes to store your inputs.
                    </span>,
                onConfirm: () => setAllPodData(podNotifications),
                onCancel: onSave
            });
        }
    }

    const onSuccess = () => showMessage("Notifications for Pod Appointments updated")

    const onSave = () => {
        if (selectedSC) dispatch(updatePodNotifications(selectedSC.id, allPodData, onSuccess, showError))
    }

    const onAddEmployee = () => {
        if (currentEmployee && selectedPod) {
            if (currentPodData) {
                const updated = {...currentPodData, usersList: currentPodData.usersList ? Array.from(new Set([...currentPodData.usersList, currentEmployee.id]))
                        : [currentEmployee.id]}
                const data = allPodData.filter(el => el.id !== currentPodData.id)
                setAllPodData([...data, updated])
            }
            setCurrentEmployee(null)
        }
    }

    const deleteEmployee = (id: string) => {
        if (currentPodData && currentPodData.usersList){
            const updated = {...currentPodData, usersList: currentPodData.usersList.filter(el => el !== id)}
            const data = allPodData.filter(el => el.id !== currentPodData.id)
            setAllPodData([...data, updated])
        }
    }

    return (
        <div>
            <div className={classes.tabWrapper}>
                {loading || isLoading || podsLoading
                    ? <Loading/>
                    : <React.Fragment>
                        <div className={classes.tabTitle}>POD Appointments</div>
                        <Autocomplete
                            options={shortPodsList}
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
                                options={usersShort}
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
                                <div className={classes.employeeWrapper} key={item.id}>
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
                    </React.Fragment>}
            </div>
            <Divider style={{margin: '24px 0'}}/>
            <DialogActions style={{padding: '0 24px 0 0'}}>
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