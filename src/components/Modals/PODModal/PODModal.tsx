import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {DialogProps} from "../types";
import {EAppointmentType, EJobType, IPod, IPodForm} from "../../../store/reducers/pods/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {useException, useMessage, useModal, useSCs} from "../../../utils/hooks";
import {Button, FormControlLabel, Grid, Switch, withStyles} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {SC_UNDEFINED} from "../../../config/constants";
import {useDispatch, useSelector} from "react-redux";
import {TextField} from "../../UI/TextField";
import {IAdvisorShort} from "../../../store/reducers/users/types";
import {IBayShort} from "../../../store/reducers/bays/types";
import {IAssignedServiceRequestShort} from "../../../store/reducers/serviceRequests/types";
import {autocompleteOptionsRender, autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {RootState} from "../../../store/rootReducer";
import {
    loadSCAdvisors,
    loadSCEmployees
} from "../../../store/reducers/employees/actions";
import {loadSCRequestsShort} from "../../../store/reducers/serviceRequests/actions";
import {createPod, updatePod} from "../../../store/reducers/pods/actions";
import {loadBaysShort} from "../../../store/reducers/bays/actions";
import {IMakeExtended, IModel} from "../../../api/types";
import {getOptions} from "../../../utils/utils";
import {EmployeeSchedule} from "../EmployeeSchedule/EmployeeSchedule";
import {loadEngineType, loadMakesForPods} from "../../../store/reducers/vehicleDetails/actions";
import {TZone} from "../../../store/reducers/mobileService/types";
import {loadMobServiceZones} from "../../../store/reducers/mobileService/actions";
import {loadServiceValetZones} from "../../../store/reducers/serviceValet/actions";
import {IEngineType} from "../../../store/reducers/vehicleDetails/types";

type TForm = {
    name: string;
    description: string;
    advisor: IAdvisorShort | null;
    technicians: IAdvisorShort[];
    bays: IBayShort[];
    serviceRequests: IAssignedServiceRequestShort[];
    isVisitCenter: boolean;
}

const initialForm: TForm = {
    name: "",
    description: "",
    advisor: null,
    technicians: [],
    bays: [],
    serviceRequests: [],
    isVisitCenter: true,
}

type TOption = {
    value: number;
    name: string;
}

const Label = withStyles({
    label: {
        fontWeight: "bold",
        color: '#7898FF',
        textTransform: 'uppercase',
        fontSize: 14,
    }
})(FormControlLabel);

export const PODModal: React.FC<DialogProps<IPod>> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const {selectedSC} = useSCs();
    const [loading, setLoading] = useState<boolean>();
    const [selectedMakes, setSelectedMakes] = useState<IMakeExtended[]>([]);
    const [modelsOptions, setModelsOptions] = useState<IModel[]>([]);
    const [selectedModels, setSelectedModels] = useState<IModel[]>([]);
    const [mobileZones, setMobileZones] = useState<TZone[]>([]);
    const [selectedServiceValetZones, setSelectedServiceValetZones] = useState<TZone[]>([]);
    const [selectedEngineTypes, setSelectedEngineTypes] = useState<IEngineType[]>([]);
    const [jobType, setJobType] = useState<TOption|null>(null);
    const [appointmentType, setAppointmentType] = useState<TOption|null>(null);
    const {onOpen, isOpen, onClose} = useModal();
    const showError = useException();
    const showMessage = useMessage();
    const dispatch = useDispatch();
    const [
        advisorsList,
        techniciansList,
        serviceRequests,
        baysList,
        makesModels,
        zones,
        serviceValetZones,
        engineTypes,
    ] = useSelector((state: RootState) => [
        state.scEmployees.advisorsList,
        state.scEmployees.techniciansList,
        state.serviceRequests.scRequestsShort,
        state.bays.baysShort,
        state.vehicleDetails.makesModels,
        state.mobileService.zones,
        state.serviceValet.zones,
        state.vehicleDetails.engineTypes,
    ]);

    const jobTypeOptions: TOption[] = useMemo(() => getOptions(Object.keys(EJobType).filter(key => Number.isNaN(+key))), []);
    const appointmentTypeOptions: TOption[] = useMemo(() => getOptions(Object.keys(EAppointmentType).filter(key => Number.isNaN(+key))), []);

    useEffect(() => {
        if (props.open) {
            setForm({
                ...initialForm,
                ...payload,
                bays: payload?.bays ?? [],
            });
            if (typeof payload?.jobType !== "undefined") {
                const selectedJobType = jobTypeOptions.find(item => item.value === payload.jobType);
                selectedJobType && setJobType(selectedJobType);
            } else {
                setJobType(null);
            }
            if (typeof payload?.appointmentType !== "undefined") {
                const selectedAppointmentType = appointmentTypeOptions.find(item => item.value === payload.appointmentType);
                selectedAppointmentType && setAppointmentType(selectedAppointmentType);
            } else {
                setAppointmentType(null)
            }
            if (payload?.mobileZones) {
                setMobileZones(zones.filter(zone => payload?.mobileZones?.find(item => item.id === zone.id)))
            } else {
                setMobileZones([]);
            }
            if (payload?.serviceValetZones) {
                setSelectedServiceValetZones(serviceValetZones.filter(zone => payload?.serviceValetZones?.find(item => item.id === zone.id)))
            } else {
                setSelectedServiceValetZones([]);
            }
            if (payload?.engineTypes) {
                setSelectedEngineTypes(engineTypes.filter(zone => payload?.engineTypes?.find(item => item.id === zone.id)))
            } else {
                setSelectedEngineTypes([]);
            }
        }
    }, [props.open, payload, makesModels, engineTypes, serviceValetZones, zones]);

    useEffect(() => {
        if (payload?.vehicleModels?.length) {
            const models: IModel[][] = [];
            makesModels.forEach(item => {
                const makeIsSelected = payload?.vehicleMakes?.find(make => make.id === item.id);
                if (makeIsSelected) {
                    models.push(item.models)
                }
            });
            const modelsIDs = models.flat().map(item => item.id);
            const filteredModels = payload?.vehicleModels?.filter(item => modelsIDs.includes(item.id))
            const filteredMakes = makesModels.filter(item => payload?.vehicleMakes?.find(el => el.id === item.id));
            setSelectedMakes(filteredMakes);
            setModelsOptions(filteredMakes.map(make => make.models).flat())
            setSelectedModels(filteredModels);
        } else {
            setSelectedMakes([])
            setSelectedModels([])
            setModelsOptions([])
        }
    }, [makesModels, props.open, payload])

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

                if (payload) {
                    await dispatch(updatePod(data, payload.id));
                } else {
                    await dispatch(createPod(data));
                }
                setLoading(false);
                showMessage(`POD ${payload ? "updated" : "created"}`);
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

    return <BaseModal {...props} maxWidth="md">
        <DialogTitle onClose={props.onClose}>
            {payload ? "Edit POD" : "Add POD"}
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        id="name"
                        name="name"
                        label="Name"
                        placeholder="Type Name"
                        fullWidth
                        autoComplete="pod-name pod"
                        onChange={handleChange}
                        value={form.name}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        id="description"
                        name="description"
                        label="Description"
                        placeholder="Type Description"
                        fullWidth
                        autoComplete="pod-description"
                        onChange={handleChange}
                        value={form.description}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <Autocomplete
                        options={advisorsList}
                        onChange={handleSelectAdv}
                        getOptionLabel={i => i.fullName}
                        getOptionSelected={(o, s) => o.id === s.id}
                        loading={false}
                        value={form.advisor}
                        renderInput={autocompleteRender({label: "Advisor", fullWidth: true, placeholder: "Select Advisor"})}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
                    <Autocomplete
                        options={appointmentTypeOptions}
                        getOptionLabel={i => i.name}
                        value={appointmentType}
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
                        ChipProps={{
                            color: "primary",
                            style: {borderRadius: 4},
                            size: "small"
                        }}
                        disableCloseOnSelect
                        onChange={handleSCChange}
                        getOptionLabel={i => i.code}
                        getOptionSelected={(o, v) => o.id === v.id}
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
                        ChipProps={{
                            color: "primary",
                            style: {borderRadius: 4},
                            size: "small"
                        }}
                        options={getSortedMakes()}
                        disableCloseOnSelect
                        getOptionLabel={i => i.name}
                        getOptionSelected={(o, v) => o.id === v.id}
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
                        getOptionSelected={(o, v) => o.id === v.id}
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
                        options={jobTypeOptions}
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
                        options={engineTypes}
                        multiple
                        fullWidth
                        ChipProps={{
                            color: "primary",
                            style: {borderRadius: 4},
                            size: "small"
                        }}
                        disableCloseOnSelect
                        getOptionSelected={(o, v) => o.id === v.id}
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
                        options={serviceValetZones}
                        multiple
                        fullWidth
                        ChipProps={{
                            color: "primary",
                            style: {borderRadius: 4},
                            size: "small"
                        }}
                        disableCloseOnSelect
                        getOptionSelected={(o, v) => o.id === v.id}
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
                        options={zones}
                        multiple
                        fullWidth
                        ChipProps={{
                            color: "primary",
                            style: {borderRadius: 4},
                            size: "small"
                        }}
                        disableCloseOnSelect
                        getOptionSelected={(o, v) => o.id === v.id}
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
                        getOptionSelected={(o, v) => o.id === v.id}
                        renderOption={autocompleteOptionsRender((e) => e.fullName)}
                        loading={false}
                        value={form.technicians}
                        renderInput={autocompleteRender({label: "Technicians", fullWidth: true, placeholder: "Select Technicians"})}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <Autocomplete
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
                        getOptionSelected={(o, v) => o.id === v.id}
                        renderOption={autocompleteOptionsRender((e) => e.name)}
                        loading={false}
                        value={form.bays}
                        renderInput={autocompleteRender({label: "Bays", fullWidth: true, placeholder: "Select Bays"})}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
                        <Button onClick={onOpen}
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
                            control={<Switch color="primary" />}
                        />
                    </div>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
                Cancel
            </Button>
            <LoadingButton
                onClick={handleSave}
                loading={loading}
                variant="contained"
                color="primary"
            >
                Save
            </LoadingButton>
        </DialogActions>
        <EmployeeSchedule open={isOpen} onClose={onClose}/>
    </BaseModal>
}