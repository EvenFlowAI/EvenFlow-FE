import React, {useEffect, useState} from "react";
import {DialogProps} from "../types";
import {
    ISRAdminForm,
    ISRAdmin
} from "../../../store/reducers/serviceRequests/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Grid} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage} from "../../../utils/hooks";
import {useDispatch} from "react-redux";
import {createAdminServiceRequest, updateAdminServiceRequest} from "../../../store/reducers/serviceRequests/actions";
import {ToggleButtons} from "../../UI/ToggleButtons";

type TForm = {
    code: string;
    description: string;
    durationInHours: string;
    countOfTechnicians: string;
    skillLevelOfTechnicians: number;
    invoiceAmount: string;
    warrantyInvoiceAmount: string;
    partsUnitCost: string;
    numberOfParts: string;
}

const initialForm: TForm = {
    code: "",
    description: "",
    durationInHours: "",
    countOfTechnicians: "",
    skillLevelOfTechnicians: 0,
    invoiceAmount: "",
    warrantyInvoiceAmount: "",
    partsUnitCost: "",
    numberOfParts: "",
};

export const CreateOPsCode: React.FC<DialogProps<ISRAdmin>> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [isLoading, setLoading] = useState<boolean>(false);
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.open) {
            if (payload) {
                setForm({
                    code: payload.code,
                    description: payload.description,
                    skillLevelOfTechnicians: payload.skillLevelOfTechnicians,
                    durationInHours: String(payload.durationInHours),
                    countOfTechnicians: String(payload.countOfTechnicians),
                    warrantyInvoiceAmount: String(payload.warrantyInvoiceAmount),
                    invoiceAmount: String(payload.invoiceAmount),
                    partsUnitCost: String(payload.partsUnitCost),
                    numberOfParts: String(payload.numberOfParts),
                });
            } else {
                setForm(initialForm);
            }
        }
    }, [props.open, payload]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }
    const handleLevelChange = (e: any, val: number) => {
        setForm({...form, skillLevelOfTechnicians: val});
    }
    const handleSave = async () => {
        setLoading(true);
        try {
            const {description, code, skillLevelOfTechnicians, ...f} = form;
            const data: ISRAdminForm = {
                code, description, skillLevelOfTechnicians,
                countOfTechnicians: Number(f.countOfTechnicians),
                durationInHours: Number(f.durationInHours),
                invoiceAmount: Number(f.invoiceAmount),
                warrantyInvoiceAmount: Number(f.warrantyInvoiceAmount),
                partsUnitCost: Number(f.partsUnitCost),
                numberOfParts: Number(f.numberOfParts),
            };
            if (!payload) {
                await dispatch(createAdminServiceRequest(data));
            } else {
                await dispatch(updateAdminServiceRequest(
                    data,
                    payload.id,
                ));
            }
            setLoading(false);
            showMessage("Saved");
            props.onClose();
        } catch (e) {
            setLoading(false);
            showError(e);
        }
    }

    return <BaseModal {...props} maxWidth="xs">
        <DialogTitle onClose={props.onClose}>{payload ? "Edit" : "Add"} Service Request</DialogTitle>
        <DialogContent>
            <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={12}>
                    <TextField
                        label="Service Ops Code name"
                        fullWidth
                        name="code"
                        id="code"
                        onChange={handleChange}
                        autoComplete="service-code code"
                        value={form.code}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Service description"
                        value={form.description}
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
                        onChange={handleChange}
                        type="number"
                        inputProps={{min: .5, step: .5}}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Number of technicians"
                        name="countOfTechnicians"
                        id="countOfTechnicians"
                        autoComplete="technicians-count"
                        value={form.countOfTechnicians}
                        onChange={handleChange}
                        type="number"
                        inputProps={{min: 1}}
                    />
                </Grid>
                <Grid item xs={12}>
                    <ToggleButtons
                        value={form.skillLevelOfTechnicians}
                        label="Technician level"
                        buttons={[
                            {id: "1", label: "1", value: 1},
                            {id: "2", label: "2", value: 2},
                            {id: "3", label: "3", value: 3}
                        ]}
                        exclusive
                        onChange={handleLevelChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Warranty invoice"
                        startAdornment="$"
                        name="warrantyInvoiceAmount"
                        id="warrantyInvoiceAmount"
                        autoComplete="warranty-invoice-amount invoice-amount"
                        value={form.warrantyInvoiceAmount}
                        onChange={handleChange}
                        type="number"
                        inputProps={{min: 1}}
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
                        onChange={handleChange}
                        type="number"
                        inputProps={{min: 1}}
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
                        onChange={handleChange}
                        type="number"
                        inputProps={{min: 1}}
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
}