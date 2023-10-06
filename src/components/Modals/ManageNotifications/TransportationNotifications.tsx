import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {useNotificationStyles} from "./ManageNotifications";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Button, Divider, IconButton} from "@material-ui/core";
import {DialogActions} from "../BaseModal";
import {ReactComponent as PlusIcon} from "../../../assets/img/plus.svg";
import {ReactComponent as DeleteIcon} from "../../../assets/img/close.svg";
import {useConfirm, useException, useMessage, useSCs} from "../../../utils/hooks";
import {TTransportationNotifications} from "../../../store/reducers/notifications/types";
import {
    setLoading,
    updateTransportationNotifications
} from "../../../store/reducers/notifications/actions";
import {TNotificatonsProps} from "./ServiceCenterAppointments";
import {Loading} from "../../UI/Loading";
import {checkTransportationAreTheSame} from "./utils";
import {IAdvisorShort} from "../../../store/reducers/users/types";
import {loadTransportationOptions} from "../../../store/reducers/transportationNeeds/actions";
import {ITransportationOptionFull} from "../../../store/reducers/transportationNeeds/types";
import {getTransportationOptionString} from "../../../utils/utils";

const TransportationNotifications: React.FC<TNotificatonsProps> = ({setChangesState, changesState}) => {
    const {usersShort, loading} = useSelector((state: RootState) => state.employees);
    const {options, isLoading} = useSelector((state: RootState) => state.transportation);
    const {transportationNotifications, isLoading: isSaving} = useSelector((state: RootState) => state.notifications);
    const [currentEmployee, setCurrentEmployee] = useState<IAdvisorShort|null>(null);
    const [allTransportationData, setAllTransportationData] = useState<TTransportationNotifications[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<IAdvisorShort[]>([]);
    const [selectedTransportation, setSelectedTransportation] = useState<ITransportationOptionFull|null>(null);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const {askConfirm} = useConfirm();
    const showError = useException();
    const showMessage = useMessage();
    const classes = useNotificationStyles();
    const currentTransportationData = useMemo(() => allTransportationData.find(el => el.transportationId === selectedTransportation?.id), [allTransportationData, selectedTransportation])

    useEffect(() => {
        const changesSaved = checkTransportationAreTheSame(allTransportationData, transportationNotifications)
        setChangesState(prevState => ({...prevState, podNotificationsSaved: changesSaved}))
    }, [allTransportationData, transportationNotifications])

    useEffect(() => {
        setAllTransportationData(transportationNotifications)
    }, [transportationNotifications])

    useEffect(() => {
        if (selectedSC) dispatch(loadTransportationOptions(selectedSC.id))
    }, [selectedSC])

    useEffect(() => {
        dispatch(setLoading(true))
        if (transportationNotifications.length) {
            const pod = options.find(el => el.id === transportationNotifications[0].transportationId)
            pod && setSelectedTransportation(pod)
        }
        dispatch(setLoading(false))
    }, [transportationNotifications, options])

    useEffect(() => {
        if (currentTransportationData?.usersList) {
            const selected = usersShort.filter(el => currentTransportationData?.usersList?.includes(el.id))
            setSelectedEmployees(selected)
        }
    }, [usersShort, currentTransportationData])

    const onEmployeeChange = (e: ChangeEvent<{}>, value: IAdvisorShort|null) => {
        setCurrentEmployee(value)
    }

    const onTransportationChange = (e: ChangeEvent<{}>, value: ITransportationOptionFull|null) => {
        const transportationData = allTransportationData.find(el => el.transportationId === value?.id);
        if (transportationData) {
            const selected = usersShort.filter(el => transportationData.usersList?.includes(el.id))
            setSelectedEmployees(selected)
        } else {
            if (value) {
                setAllTransportationData(prevState => ([...prevState, {transportationId: value?.id, usersList: []}]))
            } else {
                setAllTransportationData(prevState => prevState.filter(item => item.transportationId !== selectedTransportation?.id))
            }
            setSelectedEmployees([])
        }
        setSelectedTransportation(value)
    }

    const onCancel = () => {
        if (changesState?.transportationNotificationsSaved) {
            setAllTransportationData(transportationNotifications)
        } else {
            askConfirm({
                isRemove: true,
                confirmContent: "Cancel changes",
                cancelContent: "Save changes",
                title: "Cancel Transportation Notifications changes",
                content: <span>
                       By clicking Cancel, your entries across all Transportations will not be saved.<br />
                     Click Save Changes to store your inputs.
                    </span>,
                onConfirm: () => setAllTransportationData(transportationNotifications),
                onCancel: onSave
            });
        }
    }

    const onSuccess = () => showMessage("Notifications for Transportations updated")

    const onSave = () => {
        if (selectedSC) dispatch(updateTransportationNotifications(selectedSC.id, allTransportationData, onSuccess, showError))
    }

    const onAddEmployee = () => {
        if (currentEmployee && selectedTransportation) {
            if (currentTransportationData) {
                const updated = {...currentTransportationData, usersList: currentTransportationData.usersList ? Array.from(new Set([...currentTransportationData.usersList, currentEmployee.id]))
                        : [currentEmployee.id]}
                const data = allTransportationData.filter(el => el.transportationId !== currentTransportationData.transportationId)
                setAllTransportationData([...data, updated])
            }
            setCurrentEmployee(null)
        }
    }

    const deleteEmployee = (id: string) => {
        if (currentTransportationData && currentTransportationData.usersList){
            const updated = {...currentTransportationData, usersList: currentTransportationData.usersList.filter(el => el !== id)}
            const data = allTransportationData.filter(el => el.transportationId !== currentTransportationData.transportationId)
            setAllTransportationData([...data, updated])
        }
    }

    return (
        <div>
            <div className={classes.tabWrapper}>
                {loading || isLoading || isSaving
                    ? <Loading/>
                    : <React.Fragment>
                        <div className={classes.tabTitle}>Transportation Requests</div>
                        <Autocomplete
                            options={options.filter(el => el.state === 1)}
                            fullWidth
                            disabled={loading || isSaving || isLoading}
                            getOptionLabel={i => getTransportationOptionString(i.type)}
                            value={selectedTransportation}
                            onChange={onTransportationChange}
                            style={{marginBottom: 24}}
                            renderInput={autocompleteRender({
                                label: '',
                                placeholder: 'Select Transportation'
                            })}
                        />
                        <div className={classes.selectWrapper}>
                            <Autocomplete
                                options={usersShort}
                                disabled={loading || isSaving || isLoading}
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
                                disabled={loading || isSaving || isLoading}
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
                                        disabled={loading || isSaving || isLoading}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                    </React.Fragment>}
            </div>
            <Divider style={{margin: '24px 0'}}/>
            <DialogActions style={{padding: '0 24px 0 0'}}>
                <Button onClick={onCancel} variant="outlined" color="primary" disabled={loading || isSaving || isLoading}>
                    Cancel
                </Button>
                <Button onClick={onSave} variant="contained" color="primary" disabled={loading || isSaving || isLoading}>
                    Save
                </Button>
            </DialogActions>
        </div>
    );
};

export default TransportationNotifications;