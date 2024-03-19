import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {EAppointmentType, EJobType, IPodForm} from "../../../../store/reducers/pods/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button, Grid, Switch} from "@mui/material";
import {SC_UNDEFINED} from "../../../../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {IAdvisorShort} from "../../../../store/reducers/users/types";
import {IBayShort} from "../../../../store/reducers/bays/types";
import {IAssignedServiceRequestShort} from "../../../../store/reducers/serviceRequests/types";
import {autocompleteOptionsRender, autocompleteRender} from "../../../../utils/autocompleteRenders";
import { Autocomplete } from '@mui/material';
import {RootState} from "../../../../store/rootReducer";
import {
    loadSCAdvisors,
    loadSCEmployees
} from "../../../../store/reducers/employees/actions";
import {loadSCRequestsShort} from "../../../../store/reducers/serviceRequests/actions";
import {createPod, loadPodById, setPodById, updatePod} from "../../../../store/reducers/pods/actions";
import {loadBaysShort} from "../../../../store/reducers/bays/actions";
import {IMakeExtended, IModel} from "../../../../api/types";
import {getOptions, getTransportationOptionString} from "../../../../utils/utils";
import {EmployeeSchedule} from "../../../../components/modals/admin/EmployeeSchedule/EmployeeSchedule";
import {loadEngineType, loadMakesForPods} from "../../../../store/reducers/vehicleDetails/actions";
import {TZone} from "../../../../store/reducers/mobileService/types";
import {loadMobServiceZones} from "../../../../store/reducers/mobileService/actions";
import {loadServiceValetZones} from "../../../../store/reducers/serviceValet/actions";
import {IEngineType} from "../../../../store/reducers/vehicleDetails/types";
import {ITransportationOptionFull} from "../../../../store/reducers/transportationNeeds/types";
import {loadTransportationOptions} from "../../../../store/reducers/transportationNeeds/actions";
import {Label} from "./styles";
import {TForm, TOption} from "./types";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";
import {useModal} from "../../../../hooks/useModal/useModal";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

const initialForm: TForm = {
    name: "",
    description: "",
    advisor: null,
    technicians: [],
    bays: [],
    serviceRequests: [],
    isVisitCenter: true,
}

export const PODModal: React.FC<DialogProps & {editingItemId: number|undefined}> = ({onAction, editingItemId, ...props}) => {
    const {advisorsList, techniciansList} = useSelector(({scEmployees}: RootState) => scEmployees);
    const {scRequestsShort: serviceRequests} = useSelector(({serviceRequests}: RootState) => serviceRequests);
    const {baysShort: baysList} = useSelector(({bays}: RootState) => bays);
    const {makesModels, engineTypes} = useSelector(({vehicleDetails}: RootState) => vehicleDetails);
    const {options: transportations, isLoading: isTransportationLoading} = useSelector(({transportation}: RootState) => transportation);
    const {zones: serviceValetZones} = useSelector(({serviceValet}: RootState) => serviceValet);
    const {zones} = useSelector(({mobileService}: RootState) => mobileService);
    const {podsLoading, podById} = useSelector(({pods}: RootState) => pods);

    const [form, setForm] = useState<TForm>(initialForm);
    const [loading, setLoading] = useState<boolean>();
    const [selectedMakes, setSelectedMakes] = useState<IMakeExtended[]>([]);
    const [modelsOptions, setModelsOptions] = useState<IModel[]>([]);
    const [selectedModels, setSelectedModels] = useState<IModel[]>([]);
    const [mobileZones, setMobileZones] = useState<TZone[]>([]);
    const [selectedServiceValetZones, setSelectedServiceValetZones] = useState<TZone[]>([]);
    const [selectedEngineTypes, setSelectedEngineTypes] = useState<IEngineType[]>([]);
    const [jobType, setJobType] = useState<TOption|null>(null);
    const [appointmentType, setAppointmentType] = useState<TOption|null>(null);
    const [transportationOptions, setTransportationOptions] = useState<ITransportationOptionFull[]>([]);
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();
    const dispatch = useDispatch();
    const {onOpen, isOpen, onClose} = useModal();

    const jobTypeOptions: TOption[] = useMemo(() => getOptions(Object.keys(EJobType).filter(key => Number.isNaN(+key))), []);
    const appointmentTypeOptions: TOption[] = useMemo(() => getOptions(Object.keys(EAppointmentType).filter(key => Number.isNaN(+key))), []);

    useEffect(() => {
        if (props.open) {
            if (editingItemId) {
                dispatch(loadPodById(editingItemId))
            } else {
                setForm(initialForm)
            }
        }
    }, [editingItemId, props.open])

    useEffect(() => {
        if (props.open) {
            setForm({
                ...initialForm,
                ...podById,
                bays: podById?.bays ?? [],
            });
            if (typeof podById?.jobType !== "undefined") {
                const selectedJobType = jobTypeOptions.find(item => item.value === podById.jobType);
                selectedJobType && setJobType(selectedJobType);
            } else {
                setJobType(null);
            }
            if (typeof podById?.appointmentType !== "undefined") {
                const selectedAppointmentType = appointmentTypeOptions.find(item => item.value === podById.appointmentType);
                selectedAppointmentType && setAppointmentType(selectedAppointmentType);
            } else {
                setAppointmentType(null)
            }
            if (podById?.mobileZones) {
                setMobileZones(zones.filter(zone => podById?.mobileZones?.find(item => item.id === zone.id)))
            } else {
                setMobileZones([]);
            }
            if (podById?.serviceValetZones) {
                setSelectedServiceValetZones(serviceValetZones.filter(zone => podById?.serviceValetZones?.find(item => item.id === zone.id)))
            } else {
                setSelectedServiceValetZones([]);
            }
            if (podById?.engineTypes) {
                setSelectedEngineTypes(engineTypes.filter(zone => podById?.engineTypes?.find(item => item.id === zone.id)))
            } else {
                setSelectedEngineTypes([]);
            }
            if (podById?.transportationOptions) {
                setTransportationOptions(transportations.filter(item => podById?.transportationOptions?.find(el => el.id === item.id)))
            } else {
                setTransportationOptions([]);
            }
        }
    }, [props.open, podById, makesModels, engineTypes, serviceValetZones, zones, transportations]);

    useEffect(() => {
        const filteredMakes = makesModels.filter(item => podById?.vehicleMakes?.find(el => el.id === item.id));
        const models: IModel[][] = [];
        makesModels.forEach(item => {
            const makeIsSelected = podById?.vehicleMakes?.find(make => make.id === item.id);
            if (makeIsSelected) {
                models.push(item.models)
            }
        });
        setModelsOptions(filteredMakes.map(make => make.models).flat())
        if (podById?.vehicleMakes) {
            setSelectedMakes(filteredMakes);
        } else {
            setSelectedMakes([])
        }
        if (podById?.vehicleModels?.length) {
            const modelsIDs = models.flat().map(item => item.id);
            const filteredModels = podById?.vehicleModels?.filter(item => modelsIDs.includes(item.id))
            setSelectedModels(filteredModels);
        } else {
            setSelectedModels([])
        }
    }, [makesModels, props.open, podById])

    useEffect(() => {
        if (selectedSC && props.open) {
            dispatch(loadSCAdvisors(selectedSC.id));
            dispatch(loadSCEmployees(selectedSC.id));
            dispatch(loadSCRequestsShort(selectedSC.id));
            dispatch(loadBaysShort(selectedSC.id));
            dispatch(loadMakesForPods(selectedSC.id));
            dispatch(loadMobServiceZones(selectedSC.id));
            dispatch(loadServiceValetZones(selectedSC.id));
            dispatch(loadEngineType(selectedSC.id))
            dispatch(loadTransportationOptions(selectedSC.id));
        }
    }, [selectedSC, dispatch, props.open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }
    const handleSelectAdv = (e: React.ChangeEvent<{}>, val: IAdvisorShort | null) => {
        setForm({...form, advisor: val});
    }
    const handleTechniciansChange = (e: any, val: IAdvisorShort[]) => {
        setForm({...form, technicians: val});
    }
    const handleSCChange = (e: any, val: IAssignedServiceRequestShort[]) => {
        setForm({...form, serviceRequests: val});
    }
    const handleZoneChange = (e: any, val: TZone[]) => {
        setMobileZones(val);
    }

    const handleEngineTypesChange = (e: any, val: IEngineType[]) => {
        setSelectedEngineTypes(val);
    }

    const handleServiceValetZoneChange = (e: any, val: TZone[]) => {
        setSelectedServiceValetZones(val);
    }

    const handleBaysChange = (e: any, val: IBayShort[]) => {
        setForm({...form, bays: val});
    }

    const handleTransportationsChange = (e: any, val: ITransportationOptionFull[]) => {
        setTransportationOptions(val);
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setLoading(true);
            try {
                const data: IPodForm = {
                    advisorId: form.advisor?.id || null,
                    bays: form.bays.map(item => item.id),
                    description: form.description,
                    name: form.name,
                    serviceCenterId: selectedSC.id,
                    serviceRequests: form.serviceRequests.map(sr => sr.id),
                    technicians: form.technicians.map(t => t.id),
                    vehicleMakes: selectedMakes.map(item => item.id),
                    vehicleModels: selectedModels.map(item => item.id),
                    mobileZones: mobileZones.map(zone => zone.id),
                    serviceValetZones: selectedServiceValetZones.map(zone => zone.id),
                    engineTypes: selectedEngineTypes.map(type => type.id),
                    isVisitCenter: form.isVisitCenter,
                };
                if (jobType) data.jobType = jobType.value;
                if (appointmentType) data.appointmentType = appointmentType.value;
                if (transportationOptions?.length) data.transportationOptionIds = transportationOptions.map(el => el.id);
                if (editingItemId && podById) {
                    await dispatch(updatePod(data, podById.id));
                } else {
                    await dispatch(createPod(data));
                }
                setLoading(false);
                showMessage(`Service Book ${podById ? "updated" : "created"}`);
                props.onClose();
            } catch (e) {
                setLoading(false);
                showError(e);
            }
        }
    }

    const getSortedMakes = () => {
        return [...makesModels]
            .sort((a, b) => selectedMakes.find(make => make.id === a.id) ? selectedMakes.find(make => make.id === b.id) ? 0 : -1 : 1);
    }

    const getSortedModels = () => {
        return modelsOptions.sort((a, b) => selectedModels.find(model => model.id === a.id)
            ? selectedModels.find(model => model.id === b.id)
                ? 0
                : -1
            : 1);
    }

    const onMakeChange = useCallback((e: ChangeEvent<{}>, value: IMakeExtended[]) => {
        setSelectedMakes(value);
        setModelsOptions(value.map(make => make.models).flat());
        setSelectedModels(prev => prev.filter(item => value.find(make => make.models.find(model => model.id === item.id))));
    }, [selectedMakes])

    const onModelChange = useCallback((e: ChangeEvent<{}>, value: IModel[]) => {
        setSelectedModels(value);
    }, [])

    const onJobTypeChange = useCallback((e: ChangeEvent<{}>, value: TOption|null) => {
        setJobType(value)
    }, [])
    const onAppointmentTypeChange = useCallback((e: ChangeEvent<{}>, value: TOption|null) => {
        setAppointmentType(value)
    }, [])

    const onIsVisitCenterChange = () => {
        setForm(prev => ({...prev, isVisitCenter: !form.isVisitCenter}))
    }

    const onCancel = () => {
        dispatch(setPodById(null))
        props.onClose()
    }

    return (
        <BaseModal {...props} maxWidth="md" onClose={onCancel}>
            <DialogTitle onClose={onCancel}>
                {editingItemId ? "Configure Service Book" : "Add Service Book"}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="name"
                            name="name"
                            label="Name"
                            placeholder="Type Name"
                            fullWidth
                            autoComplete="pod-name pod"
                            onChange={handleChange}
                            value={form.name}
                            disabled={podsLoading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={advisorsList}
                            onChange={handleSelectAdv}
                            disabled={podsLoading}
                            getOptionLabel={i => i.fullName}
                            isOptionEqualToValue={(o, s) => o.id === s.id}
                            loading={false}
                            value={form.advisor}
                            renderInput={autocompleteRender({label: "Advisor", fullWidth: true, placeholder: "Select Advisor"})}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={6}>
                        <Autocomplete
                            options={appointmentTypeOptions}
                            getOptionLabel={i => i.name}
                            disabled={podsLoading}
                            value={appointmentType}
                            isOptionEqualToValue={(o, v) => o.value === v.value}
                            onChange={onAppointmentTypeChange}
                            renderInput={autocompleteRender({
                                label: "Appointment Type",
                                placeholder: 'Appointment Type'
                            })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Autocomplete
                            options={serviceRequests}
                            multiple
                            fullWidth
                            disabled={podsLoading}
                            ChipProps={{
                                color: "primary",
                                style: {borderRadius: 4},
                                size: "small"
                            }}
                            disableCloseOnSelect
                            onChange={handleSCChange}
                            getOptionLabel={i => i.code}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            renderOption={autocompleteOptionsRender((e) => e.code)}
                            loading={false}
                            value={form.serviceRequests}
                            renderInput={autocompleteRender({label: "Service Requests", fullWidth: true, placeholder: "Select Service Requests"})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Autocomplete
                            multiple
                            style={{ marginBottom: 10 }}
                            disabled={podsLoading}
                            ChipProps={{
                                color: "primary",
                                style: {borderRadius: 4},
                                size: "small"
                            }}
                            options={getSortedMakes()}
                            disableCloseOnSelect
                            getOptionLabel={i => i.name}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            renderOption={autocompleteOptionsRender((e) => e.name)}
                            value={selectedMakes}
                            onChange={onMakeChange}
                            renderInput={autocompleteRender({
                                label: "Makes",
                                placeholder: 'Select Makes'
                            })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Autocomplete
                            multiple
                            disabled={podsLoading}
                            style={{ marginBottom: 10 }}
                            ChipProps={{
                                color: "primary",
                                style: {borderRadius: 4},
                                size: "small"
                            }}
                            options={getSortedModels()}
                            disableCloseOnSelect
                            getOptionLabel={i => i.name}
                            renderOption={autocompleteOptionsRender((e) => e.name)}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            value={selectedModels}
                            onChange={onModelChange}
                            renderInput={autocompleteRender({
                                label: "Models",
                                placeholder: 'Select Models'
                            })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Autocomplete
                            disabled={podsLoading}
                            options={jobTypeOptions}
                            isOptionEqualToValue={(o, v) => o.value === v.value}
                            getOptionLabel={i => i.name}
                            value={jobType}
                            onChange={onJobTypeChange}
                            renderInput={autocompleteRender({
                                label: "Job Type",
                                placeholder: 'Job Type'
                            })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Autocomplete
                            disabled={podsLoading}
                            options={engineTypes}
                            multiple
                            fullWidth
                            ChipProps={{
                                color: "primary",
                                style: {borderRadius: 4},
                                size: "small"
                            }}
                            disableCloseOnSelect
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            onChange={handleEngineTypesChange}
                            getOptionLabel={i => i.name}
                            renderOption={autocompleteOptionsRender((e) => e.name)}
                            loading={false}
                            value={selectedEngineTypes}
                            renderInput={autocompleteRender({label: "Engine Types", fullWidth: true, placeholder: "Select Engine Types"})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Autocomplete
                            disabled={podsLoading}
                            options={serviceValetZones}
                            multiple
                            fullWidth
                            ChipProps={{
                                color: "primary",
                                style: {borderRadius: 4},
                                size: "small"
                            }}
                            disableCloseOnSelect
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            onChange={handleServiceValetZoneChange}
                            getOptionLabel={i => i.name}
                            renderOption={autocompleteOptionsRender((e) => e.name)}
                            loading={false}
                            value={selectedServiceValetZones}
                            renderInput={autocompleteRender({label: "Service Valet Zones", fullWidth: true, placeholder: "Select Service Valet Zones"})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Autocomplete
                            disabled={podsLoading}
                            options={zones}
                            multiple
                            fullWidth
                            ChipProps={{
                                color: "primary",
                                style: {borderRadius: 4},
                                size: "small"
                            }}
                            disableCloseOnSelect
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            onChange={handleZoneChange}
                            getOptionLabel={i => i.name}
                            renderOption={autocompleteOptionsRender((e) => e.name)}
                            loading={false}
                            value={mobileZones}
                            renderInput={autocompleteRender({label: "Mobile Zones", fullWidth: true, placeholder: "Select Mobile Zones"})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Autocomplete
                            disabled={podsLoading}
                            options={techniciansList}
                            multiple
                            ChipProps={{
                                color: "primary",
                                style: {borderRadius: 4},
                                size: "small"
                            }}
                            disableCloseOnSelect
                            onChange={handleTechniciansChange}
                            getOptionLabel={i => i.fullName}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            renderOption={autocompleteOptionsRender((e) => e.fullName)}
                            loading={false}
                            value={form.technicians}
                            renderInput={autocompleteRender({label: "Technicians", fullWidth: true, placeholder: "Select Technicians"})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Autocomplete
                            disabled={podsLoading}
                            options={baysList}
                            multiple
                            ChipProps={{
                                color: "primary",
                                style: {borderRadius: 4},
                                size: "small"
                            }}
                            disableCloseOnSelect
                            onChange={handleBaysChange}
                            getOptionLabel={i => i.name}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            renderOption={autocompleteOptionsRender((e) => e.name)}
                            loading={false}
                            value={form.bays}
                            renderInput={autocompleteRender({label: "Bays", fullWidth: true, placeholder: "Select Bays"})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Autocomplete
                            disabled={podsLoading}
                            options={transportations}
                            multiple
                            ChipProps={{
                                color: "primary",
                                style: {borderRadius: 4},
                                size: "small"
                            }}
                            disableCloseOnSelect
                            onChange={handleTransportationsChange}
                            getOptionLabel={i => getTransportationOptionString(i.type)}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            renderOption={autocompleteOptionsRender((e) => getTransportationOptionString(e.type))}
                            loading={isTransportationLoading}
                            value={transportationOptions}
                            renderInput={autocompleteRender({label: "Transportation Options", fullWidth: true, placeholder: "Select Transportation Options"})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
                            <Button
                                onClick={onOpen}
                                disabled={podsLoading}
                                color="primary">
                                Go To Employees Schedule
                            </Button>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
                            <Label
                                checked={form.isVisitCenter}
                                onChange={() => onIsVisitCenterChange()}
                                label={"For Visit Center Only"}
                                labelPlacement="start"
                                control={<Switch color="primary" disabled={podsLoading}/>}
                            />
                        </div>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="info" disabled={podsLoading}>
                    Cancel
                </Button>
                <LoadingButton
                    onClick={handleSave}
                    loading={loading || podsLoading}
                    variant="contained"
                    color="primary"
                >
                    Save
                </LoadingButton>
            </DialogActions>
            <EmployeeSchedule open={isOpen} onClose={onClose}/>
        </BaseModal>
    );
}