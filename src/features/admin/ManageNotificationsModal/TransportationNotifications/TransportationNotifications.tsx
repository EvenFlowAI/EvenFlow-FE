import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../../utils/AutocompleteRender";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Button, Divider, IconButton, Switch} from "@material-ui/core";
import {DialogActions} from "../../../../components/BaseModal/BaseModal";
import {ReactComponent as PlusIcon} from "../../../../assets/img/plus.svg";
import {ReactComponent as DeleteIcon} from "../../../../assets/img/close.svg";
import {useConfirm, useException, useMessage, useSCs} from "../../../../utils/hooks";
import {TTransportationNotifications} from "../../../../store/reducers/notifications/types";
import {
    setLoading,
    updateTransportationNotifications
} from "../../../../store/reducers/notifications/actions";
import {TNotificatonsProps} from "../types";
import {Loading} from "../../../../components/Loading/Loading";
import {checkTransportationAreTheSame} from "../utils";
import {IAdvisorShort} from "../../../../store/reducers/users/types";
import {loadTransportationOptions} from "../../../../store/reducers/transportationNeeds/actions";
import {ITransportationOptionFull} from "../../../../store/reducers/transportationNeeds/types";
import {getTransportationOptionString} from "../../../../utils/utils";
import {useNotificationStyles} from "../../../../commonStyles/useNotificationStyles";

const initialTransportationNotifications: TTransportationNotifications = {
    isActive: false,
    transportationOptions: []
}

const TransportationNotifications: React.FC<TNotificatonsProps> = ({setChangesState, changesState}) => {
    const {usersShort, loading} = useSelector((state: RootState) => state.employees);
    const {options, isLoading} = useSelector((state: RootState) => state.transportation);
    const {transportationNotifications, isLoading: isSaving} = useSelector((state: RootState) => state.notifications);
    const [currentEmployee, setCurrentEmployee] = useState<IAdvisorShort|null>(null);
    const [allTransportationData, setAllTransportationData] = useState<TTransportationNotifications|null>(initialTransportationNotifications);
    const [selectedEmployees, setSelectedEmployees] = useState<IAdvisorShort[]>([]);
    const [formChecked, setFormChecked] = useState<boolean>(false);
    const [selectedTransportation, setSelectedTransportation] = useState<ITransportationOptionFull|null>(null);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const {askConfirm} = useConfirm();
    const showError = useException();
    const showMessage = useMessage();
    const classes = useNotificationStyles();

    const currentTransportationData = useMemo(() => allTransportationData?.transportationOptions?.find(el => el.id === selectedTransportation?.id), [allTransportationData, selectedTransportation])
    const inactiveOptionsIds = useMemo(() => options.filter(op => op.state === 0).map(el => el.id), [options])
    const activeOptionsNotifications = useMemo(() => {
        if (transportationNotifications?.transportationOptions) {
            return transportationNotifications?.transportationOptions.filter(el => !inactiveOptionsIds.includes(el.id))
        }
        return []
    }, [transportationNotifications, inactiveOptionsIds])

    useEffect(() => {
        let changesSaved = true
        if (currentEmployee) {
            changesSaved = false
        } else if (allTransportationData && transportationNotifications) {
            if (allTransportationData.isActive !== transportationNotifications.isActive) {
                changesSaved = false
            } else {
                changesSaved = checkTransportationAreTheSame(allTransportationData.transportationOptions, activeOptionsNotifications)
            }
        } else if ((allTransportationData && !transportationNotifications) || (!allTransportationData && transportationNotifications)) {
            changesSaved = false
        }
        setChangesState(prevState => ({...prevState, transportationNotificationsSaved: changesSaved}))
    }, [allTransportationData, transportationNotifications, currentEmployee, activeOptionsNotifications])

    useEffect(() => {
        if (transportationNotifications?.transportationOptions) {
            setAllTransportationData({
                isActive: transportationNotifications.isActive,
                transportationOptions: activeOptionsNotifications
            })
        } else {
            setAllTransportationData(transportationNotifications)
        }
    }, [transportationNotifications, activeOptionsNotifications])

    useEffect(() => {
        if (selectedSC) dispatch(loadTransportationOptions(selectedSC.id))
    }, [selectedSC])

    useEffect(() => {
        dispatch(setLoading(true))
        if (activeOptionsNotifications?.length) {
            const option = options.find(el => el.id === activeOptionsNotifications[0].id)
            option && setSelectedTransportation(prevState => prevState ?? option)
        }
        dispatch(setLoading(false))
    }, [activeOptionsNotifications, options])

    useEffect(() => {
        if (currentTransportationData?.usersList) {
            const selected = usersShort.filter(el => currentTransportationData?.usersList?.includes(el.id))
            setSelectedEmployees(selected)
        }
    }, [usersShort, currentTransportationData])

    const onEmployeeChange = (e: ChangeEvent<{}>, value: IAdvisorShort|null) => {
        setFormChecked(false)
        setCurrentEmployee(value)
    }

    const onTransportationChange = (e: ChangeEvent<{}>, value: ITransportationOptionFull|null) => {
        setFormChecked(false)
        const transportationData = allTransportationData?.transportationOptions.find(el => el.id === value?.id);
        if (transportationData) {
            const selected = usersShort.filter(el => transportationData.usersList?.includes(el.id))
            setSelectedEmployees(selected)
        } else {
            if (value) {
                setAllTransportationData(prev => prev
                    ? {...prev, transportationOptions: [...prev.transportationOptions, {id: value?.id, usersList: []}]}
                    : prev)
            } else {
                setAllTransportationData(prev => prev
                    ? {...prev, transportationOptions: prev.transportationOptions.filter(item => item.id !== selectedTransportation?.id)}
                    : prev)
            }
            setSelectedEmployees([])
        }
        setSelectedTransportation(value)
    }

    const onCancel = () => {
        setFormChecked(false)
        setCurrentEmployee(null);
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

    const onSuccess = () => {
        showMessage("Notifications for TransportationOptions updated")
        setCurrentEmployee(null);
        setFormChecked(false)
    }

    const sendRequest = () => {
        if (allTransportationData) {
            const data: TTransportationNotifications = {
                ...allTransportationData,
                transportationOptions: allTransportationData?.transportationOptions.filter(el => !inactiveOptionsIds.includes(el.id))
            }
            if (selectedSC && allTransportationData) dispatch(updateTransportationNotifications(selectedSC.id, data, onSuccess, showError))
        }
    }

    const onSave = () => {
        setFormChecked(true)
        if (currentEmployee && !currentTransportationData?.usersList?.includes(currentEmployee.id)) {
            showError("Please add or remove Selected Employee")
        } else {
            sendRequest()
        }
    }

    const onAddEmployee = () => {
        setFormChecked(false)
        if (currentEmployee && selectedTransportation) {
            if (currentTransportationData) {
                const updated = {
                    ...currentTransportationData,
                    usersList: currentTransportationData.usersList
                        ? Array.from(new Set([...currentTransportationData.usersList, currentEmployee.id]))
                        : [currentEmployee.id]
                }
                const data = allTransportationData?.transportationOptions.filter(el => el.id !== currentTransportationData.id)
                data && setAllTransportationData(prev => prev ? {...prev, transportationOptions: [...data, updated]} : prev)
            }
            setCurrentEmployee(null)
        }
    }

    const handleSwitch = () => {
        setFormChecked(false)
        setAllTransportationData(prev => prev ? {...prev, isActive: prev ? !prev.isActive : true} : prev)
    }

    const deleteEmployee = (id: string) => {
        setFormChecked(false)
        if (currentTransportationData && currentTransportationData.usersList) {
            const updated = {...currentTransportationData, usersList: currentTransportationData.usersList.filter(el => el !== id)}
            const data = allTransportationData?.transportationOptions.filter(el => el.id !== currentTransportationData.id)
            data && setAllTransportationData(prev => prev ? {...prev, transportationOptions: [...data, updated]} : prev)
        }
    }

    return (
        <div>
            <div className={classes.tabWrapper}>
                {loading || isLoading || isSaving
                    ? <Loading/>
                    : <React.Fragment>
                        <div className={classes.tabTitle}>Transportation Requests</div>
                        <div className={classes.switcherWrapper}>
                            <p className={classes.notificationsLabel}>on/off Transportation notifications</p>
                            <Switch
                                onChange={handleSwitch}
                                disabled={loading || isLoading}
                                checked={allTransportationData?.isActive}
                                color="primary"
                            />
                        </div>
                        <Autocomplete
                            options={options.filter(op => op.state === 1)}
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
                                    placeholder: 'Select',
                                    error: Boolean(currentEmployee && !currentTransportationData?.usersList?.includes(currentEmployee?.id) && formChecked)
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