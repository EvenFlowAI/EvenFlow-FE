import React, {useEffect, useState} from 'react';
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {useDispatch} from "react-redux";
import {DialogProps} from "../../Modals/types";
import {IUpsellServiceRequest, IUpsellServiceRequestUpdate} from "../../../store/reducers/serviceRequests/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {Button, Grid} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {LoadingButton} from "../../UI/Button";
import {updateUpsellServiceRequest} from "../../../store/reducers/serviceRequests/actions";

type TForm = {
    description: string;
    durationInHours: string;
    invoiceAmount: string;
    partsUnitCost: string;
    numberOfParts: string;
}
const initialForm: TForm = {
    description: "",
    durationInHours: "",
    invoiceAmount: "",
    partsUnitCost: "",
    numberOfParts: "",
};

const IntervalUpsellDialog: React.FC<DialogProps<IUpsellServiceRequest>> = ({payload, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [isLoading, setLoading] = useState<boolean>(false);
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (props.open) {
            setForm(initialForm);
        }
    }, [props.open]);

    useEffect(() => {
        if (props.open && payload) {
            setForm({
                ...initialForm,
                description: payload?.description || payload?.serviceRequest?.description || "",
                durationInHours: payload?.durationInHours?.toString() || payload?.serviceRequest?.durationInHours.toString() || "",
                invoiceAmount: payload?.invoiceAmount?.toFixed(2) || payload?.serviceRequest?.invoiceAmount?.toFixed(2) || "",
                partsUnitCost: payload?.partsUnitCost?.toFixed(2) || payload?.serviceRequest?.partsUnitCost?.toFixed(2) || "",
                numberOfParts: payload?.numberOfParts?.toString() || payload?.serviceRequest?.numberOfParts?.toString() || "",
            })
        }
    }, [payload, props.open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSave = async () => {
        if (!payload) {
            showError("Data is not loaded");
        } else {
            if (selectedSC) {
                setLoading(true);
                try {
                    const data:IUpsellServiceRequestUpdate = {
                        description: form.description ?? null,
                        durationInHours: form.durationInHours ? Number(form.durationInHours) : null,
                        invoiceAmount: form.invoiceAmount ? Number(form.invoiceAmount) : null,
                        partsUnitCost: form.partsUnitCost ? Number(form.partsUnitCost) : null,
                        numberOfParts: form.numberOfParts ? Number(form.numberOfParts) : null,
                    }
                    await dispatch(updateUpsellServiceRequest(data, payload.id, selectedSC.id))
                    showMessage('Interval Upsell Request Updated');
                    setLoading(false);
                }
                catch {
                    setLoading(false);
                }
            }
        }
    }

    return <BaseModal {...props} maxWidth="xs">
        <DialogTitle onClose={props.onClose}>Edit Interval Upsell</DialogTitle>
        <DialogContent>
            <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={12}>
                    <TextField
                        label="Service Ops Code name"
                        disabled
                        fullWidth
                        value={payload?.code || ""}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Service description"
                        value={form.description}
                        placeholder={payload?.description}
                        name="description"
                        id="description"
                        autoComplete="service-description description"
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Duration (hours)"
                        name="durationInHours"
                        id="durationInHours"
                        autoComplete="duration-number duration"
                        value={form.durationInHours}
                        placeholder={payload ? String(payload.durationInHours) : ""}
                        onChange={handleChange}
                        type="number"
                        inputProps={{min: .5, step: .5}}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        startAdornment="$"
                        label="Invoice Amount"
                        name="invoiceAmount"
                        id="invoiceAmount"
                        autoComplete="invoice-amount"
                        value={form.invoiceAmount}
                        placeholder={payload ? String(payload.invoiceAmount) : ""}
                        onChange={handleChange}
                        type="number"
                        inputProps={{min: 1, step: 0.01}}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Parts Unit Cost"
                        startAdornment="$"
                        name="partsUnitCost"
                        id="partsUnitCost"
                        autoComplete="parts-unit-cost"
                        value={form.partsUnitCost}
                        placeholder={payload?.partsUnitCost?.toString() || ""}
                        onChange={handleChange}
                        type="number"
                        inputProps={{min: 1, step: 0.01}}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Number Of Parts"
                        name="numberOfParts"
                        id="numberOfParts"
                        autoComplete="number-of-parts"
                        value={form.numberOfParts}
                        placeholder={payload?.numberOfParts?.toString() || ""}
                        onChange={handleChange}
                        type="number"
                        inputProps={{min: 1}}
                    />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <LoadingButton
                loading={isLoading}
                color="primary"
                variant="contained"
                onClick={handleSave}
            >
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};

export default IntervalUpsellDialog;