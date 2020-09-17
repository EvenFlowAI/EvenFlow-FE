import React, {useEffect, useState} from "react";
import {DialogProps} from "../types";
import {IPod, IPodForm} from "../../../store/reducers/pods/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
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
import {createPod} from "../../../store/reducers/pods/actions";


type TForm = {
    name: string;
    description: string;
    advisor: IAdvisorShort | null;
    technicians: IAdvisorShort[];
    bays: IBayShort[];
    serviceRequests: IAssignedServiceRequestShort[];
}
const initialForm: TForm = {
    name: "",
    description: "",
    advisor: null,
    technicians: [],
    bays: [],
    serviceRequests: []
}

export const PODModal: React.FC<DialogProps<IPod>> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const {selectedSC} = useSCs();
    const [loading, setLoading] = useState<boolean>();
    const showError = useException();
    const showMessage = useMessage();
    const dispatch = useDispatch();
    const [advisorsList, techniciansList, serviceRequests] = useSelector((state: RootState) => [
        state.scEmployees.advisorsList,
        state.scEmployees.techniciansList,
        state.serviceRequests.scRequestsShort
    ]);

    useEffect(() => {
        if (props.open) {
            setForm({...initialForm, ...payload});
        }
    }, [props.open, payload]);
    useEffect(() => {
        if (selectedSC) {
            dispatch(loadSCAdvisors(selectedSC.id));
            dispatch(loadSCEmployees(selectedSC.id));
            dispatch(loadSCRequestsShort(selectedSC.id));
        }
    }, [selectedSC, dispatch]);

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

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setLoading(true);
            try {
                const data: IPodForm = {
                    advisorId: form.advisor?.id || null,
                    bays: form.bays.map(b => b.id),
                    description: form.description,
                    name: form.name,
                    serviceCenterId: selectedSC.id,
                    serviceRequests: form.serviceRequests.map(sr => sr.id),
                    technicians: form.technicians.map(t => t.id)
                };
                await dispatch(createPod(data));
                setLoading(false);
                showMessage("Saved");
                props.onClose();
            } catch (e) {
                setLoading(false);
                showError(e);
            }
        }
    }

    return <BaseModal {...props} maxWidth="md">
        <DialogTitle onClose={props.onClose}>
            {payload ? "Edit POD" : "Add POD"}
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={3}>
                <Grid item xs={4}>
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
                <Grid item xs={4}>
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
                <Grid item xs={4}>
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
                <Grid item xs={12}>Buttons</Grid>
                <Grid item xs={6}>
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
                        renderOption={autocompleteOptionsRender((e) => e.fullName)}
                        loading={false}
                        value={form.technicians}
                        renderInput={autocompleteRender({label: "Technicians", fullWidth: true})}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Autocomplete
                        options={serviceRequests}
                        multiple
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
    </BaseModal>
}