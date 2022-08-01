import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {DialogProps} from "../types";
import {EJobType, IPod, IPodForm} from "../../../store/reducers/pods/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {useException, useMessage, useModal, useSCs} from "../../../utils/hooks";
import {Button, Grid} from "@material-ui/core";
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
import {ConfigButton} from "../../UI/ConfigButton";
import {IMakeExtended, IModel} from "../../../api/types";
import {getOptions} from "../../../utils/utils";
import {EmployeeSchedule} from "../EmployeeSchedule/EmployeeSchedule";
import {loadMakesForPods} from "../../../store/reducers/vehicleDetails/actions";

type TForm = {
    name: string;
    description: string;
    advisor: IAdvisorShort | null;
    technicians: IAdvisorShort[];
    bays: number[];
    serviceRequests: IAssignedServiceRequestShort[];
}

const initialForm: TForm = {
    name: "",
    description: "",
    advisor: null,
    technicians: [],
    bays: [],
    serviceRequests: [],
}

type TOption = {
    value: number;
    name: string;
}

export const PODModal: React.FC<DialogProps<IPod>> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const {selectedSC} = useSCs();
    const [loading, setLoading] = useState<boolean>();
    const [formIsChecked, setFormIsChecked] = useState<boolean>();
    const [selectedMakes, setSelectedMakes] = useState<IMakeExtended[]>([]);
    const [modelsOptions, setModelsOptions] = useState<IModel[]>([]);
    const [selectedModels, setSelectedModels] = useState<IModel[]>([]);
    const [jobType, setJobType] = useState<TOption|null>(null);
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
    ] = useSelector((state: RootState) => [
        state.scEmployees.advisorsList,
        state.scEmployees.techniciansList,
        state.serviceRequests.scRequestsShort,
        state.bays.baysShort,
        state.vehicleDetails.makesModels,
    ]);

    const disabledBays: number[] = useMemo(() => {
        if (payload) {
            return baysList.filter(b => !b?.podId || b.podId === payload.id).map(b => b.id);
        }
        return baysList.filter(b => !b?.podId).map(b => b.id);
    }, [baysList, payload]);

    useEffect(() => {
        if (props.open) {
            setForm({
                ...initialForm,
                ...payload,
                bays: payload?.bays?.map(b => b.id) || []
            });
            if (payload?.vehicleMakes?.length) {
                const filteredMakes = makesModels.filter(item => payload?.vehicleMakes?.find(el => el.id === item.id));
                setSelectedMakes(filteredMakes);
            }
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
                setSelectedModels(filteredModels);
            }
        }
    }, [props.open, payload, makesModels]);
    useEffect(() => {
        if (selectedSC && props.open) {
            dispatch(loadSCAdvisors(selectedSC.id));
            dispatch(loadSCEmployees(selectedSC.id));
            dispatch(loadSCRequestsShort(selectedSC.id));
            dispatch(loadBaysShort(selectedSC.id));
            dispatch(loadMakesForPods(selectedSC.id));
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
    const handleBaySelect = (b: IBayShort) => () => {
        if (form.bays.includes(b.id)) {
            setForm({...form, bays: form.bays.filter(bayId => bayId !== b.id)});
        } else {
            setForm({...form, bays: [...form.bays, b.id]});
        }
    }

    const handleSave = async () => {
        setFormIsChecked(true)
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setLoading(true);
            try {
                const data: IPodForm = {
                    advisorId: form.advisor?.id || null,
                    bays: form.bays,
                    description: form.description,
                    name: form.name,
                    serviceCenterId: selectedSC.id,
                    serviceRequests: form.serviceRequests.map(sr => sr.id),
                    technicians: form.technicians.map(t => t.id),
                    vehicleMakes: selectedMakes.map(item => item.id),
                    vehicleModels: selectedModels.map(item => item.id),
                };
                if (payload) {
                    await dispatch(updatePod(data, payload.id));
                } else {
                    await dispatch(createPod(data));
                }
                setLoading(false);
                showMessage("Saved");
                props.onClose();
            } catch (e) {
                setLoading(false);
                showError(e);
            }
        }
    }

    const getSortedMakes = () => {
        // todo fix sorting
        return makesModels
            // .sort((a, b) => selectedMakes.find(make => make.id === a.id) ? selectedMakes.find(make => make.id === b.id) ? 0 : -1 : 1);
    }

    const getSortedModels = () => {
        return modelsOptions.sort((a, b) => selectedModels.find(model => model.id === a.id)
            ? selectedModels.find(model => model.id === b.id)
                ? 0
                : -1
            : 1);
    }

    const onMakeChange = useCallback((e: ChangeEvent<{}>, value: IMakeExtended[]) => {
        setFormIsChecked(false);
        setSelectedMakes(value);
        setModelsOptions(value.map(make => make.models).flat());
        setSelectedModels(prev => prev.filter(item => selectedMakes.find(make => make.models.find(model => model.id === item.id))));
    }, [selectedMakes])

    const onModelChange = useCallback((e: ChangeEvent<{}>, value: IModel[]) => {
        setFormIsChecked(false);
        setSelectedModels(value);
    }, [])

    const onJobTypeChange = useCallback((e: ChangeEvent<{}>, value: TOption|null) => {
        setFormIsChecked(false);
        setJobType(value)
    }, [])

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
                        renderInput={autocompleteRender({label: "Advisor", fullWidth: true})}
                    />
                </Grid>
                <Grid item xs={12}>
                    {baysList.map(bay => {
                            const checked = form.bays.includes(bay.id);
                            return <ConfigButton
                                onClick={handleBaySelect(bay)}
                                disabled={!disabledBays.includes(bay.id)}
                                color={checked ? "primary" : undefined}
                                variant="contained"
                                key={bay.id}
                            >
                                {bay.name}
                            </ConfigButton>;
                        }
                    )}
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
                        getOptionSelected={(option, value) => option.id === value.id}
                        renderOption={autocompleteOptionsRender((e) => e.fullName)}
                        loading={false}
                        value={form.technicians}
                        renderInput={autocompleteRender({label: "Technicians", fullWidth: true})}
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
                        renderOption={autocompleteOptionsRender((e) => e.code)}
                        loading={false}
                        value={form.serviceRequests}
                        renderInput={autocompleteRender({label: "Service Requests", fullWidth: true})}
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
                        renderOption={autocompleteOptionsRender(e => e.name)}
                        value={selectedMakes}
                        onChange={onMakeChange}
                        renderInput={autocompleteRender({
                            label: "Makes",
                            error: !selectedMakes.length && formIsChecked,
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
                        renderOption={autocompleteOptionsRender(e => e.name)}
                        value={selectedModels}
                        onChange={onModelChange}
                        renderInput={autocompleteRender({
                            label: "Models",
                            error: !selectedMakes.length && formIsChecked,
                            placeholder: 'Select Models'
                        })}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <Autocomplete
                        options={getOptions(Object.keys(EJobType).filter(key => Number.isNaN(+key)))}
                        renderOption={autocompleteOptionsRender(e => e.name)}
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
                    <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
                        <Button onClick={onOpen}
                                color="primary">
                            Go To Employees Schedule
                        </Button>
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