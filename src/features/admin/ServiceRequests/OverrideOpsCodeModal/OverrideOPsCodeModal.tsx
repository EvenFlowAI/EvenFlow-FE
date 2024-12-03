import React, {useEffect, useState} from "react";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {
    IAssignedServiceRequest, IServiceRequestOverride,
    IServiceRequestOverrideEditRequest
} from "../../../../store/reducers/serviceRequests/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button, Grid, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {useDispatch} from "react-redux";
import {updateAssignedServiceRequest} from "../../../../store/reducers/serviceRequests/actions";
import {TForm} from "./types";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {TOption} from "../../../../utils/types";
import {EmptyMenuItem} from "../../Appointments/AppointmentFilters/styles";

const initialForm: TForm = {
    description: "",
    durationInHours: "",
    countOfTechnicians: "",
    skillLevelOfTechnicians: 0,
    invoiceAmount: "",
    warrantyInvoiceAmount: "",
    partsUnitCost: "",
    numberOfParts: "",
};

const levels: TOption[] = [{value: 1, name: 'Level 1'}, {value: 2, name: 'Level 2'}, {value: 3, name: 'Level 3'}]

export const OverrideOPsCodeModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps<IAssignedServiceRequest>>>> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [isLoading, setLoading] = useState<boolean>(false);
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.open) {
            setForm(initialForm);
        }
    }, [props.open]);

    useEffect(() => {
        if (props.open && payload?.serviceRequestOverride) {
            const override = payload.serviceRequestOverride;
            const request = payload.serviceRequest;
            setForm({
                ...initialForm,
                description: override?.description || "",
                countOfTechnicians: override?.countOfTechnicians?.toString() || "",
                durationInHours: override?.durationInHours?.toString() || "",
                invoiceAmount: override?.invoiceAmount?.toFixed(2) || "",
                warrantyInvoiceAmount: override?.warrantyInvoiceAmount?.toFixed(2) || "",
                skillLevelOfTechnicians: override?.skillLevelOfTechnicians || 0,
                partsUnitCost: override?.partsUnitCost?.toFixed(2) ?? request?.partsUnitCost?.toFixed(2) ?? "",
                numberOfParts: override?.numberOfParts?.toString() ?? request?.numberOfParts?.toString() ?? "",
            })
        }
    }, [payload, props.open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleLevelChange = (e: SelectChangeEvent<number>) => {
        setForm({...form, skillLevelOfTechnicians: +e.target.value});
    }
    const handleSave = async () => {
        if (!payload) {
            showError("Data is not loaded");
        } else {
            setLoading(true);

            try {
                const {description, ...f} = form;
                const data: IServiceRequestOverrideEditRequest = {
                    serviceRequestInfo: {
                        description,
                        ...Object.entries(f).reduce( (acc, e) =>
                            ({...acc, [e[0]]: e[1] ? Number(e[1]) : undefined})
                        , {} as Partial<IServiceRequestOverride>)
                    }
                }
                await dispatch(updateAssignedServiceRequest(
                    data,
                    payload.id,
                    payload.serviceCenterId,
                    () => showMessage("Service Request updated"),
                    (err) => showError(err)
                ));
                setLoading(false);
                props.onClose();
            } catch (e) {
                setLoading(false);
                showError(e);
            }
        }
    }

    return <BaseModal {...props} maxWidth="xs">
        <DialogTitle onClose={props.onClose}>Edit Op Code</DialogTitle>
        <DialogContent>
            <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={12}>
                    <TextField
                        label="Op Code"
                        disabled
                        fullWidth
                        value={payload?.serviceRequest.code || ""}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Description"
                        value={form.description}
                        placeholder={payload?.serviceRequest.description}
                        name="description"
                        id="description"
                        autoComplete="service-description description"
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Labor Hours"
                        name="durationInHours"
                        id="durationInHours"
                        autoComplete="duration-number duration"
                        value={form.durationInHours}
                        placeholder={payload ? String(payload.serviceRequest.durationInHours) : ""}
                        onChange={handleChange}
                        type="number"
                        inputProps={{min: .5, step: .5}}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Select
                        value={form.skillLevelOfTechnicians}
                        variant="standard"
                        fullWidth
                        disableUnderline
                        input={<TextField label="Technician Level" placeholder="Technician Level"/>}
                        style={{color: form.skillLevelOfTechnicians ? "inherit" : '#858585'}}
                        onChange={handleLevelChange}>
                        <EmptyMenuItem value={0}>Technician Level</EmptyMenuItem>
                        {levels.map(level => <MenuItem value={level.value} key={level.name}>{level.name}</MenuItem>)}
                    </Select>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Labor Amount"
                        startAdornment="$"
                        name="warrantyInvoiceAmount"
                        id="warrantyInvoiceAmount"
                        autoComplete="warranty-invoice-amount invoice-amount"
                        value={form.warrantyInvoiceAmount}
                        placeholder={payload ? String(payload.serviceRequest.warrantyInvoiceAmount) : ""}
                        onChange={handleChange}
                        type="number"
                        inputProps={{min: 1, step: 0.01}}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        startAdornment="$"
                        label="Total Amount"
                        name="invoiceAmount"
                        id="invoiceAmount"
                        autoComplete="invoice-amount"
                        value={form.invoiceAmount}
                        placeholder={payload ? String(payload.serviceRequest.invoiceAmount) : ""}
                        onChange={handleChange}
                        type="number"
                        inputProps={{min: 1, step: 0.01}}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Parts Amount"
                        startAdornment="$"
                        name="partsUnitCost"
                        id="partsUnitCost"
                        autoComplete="parts-unit-cost"
                        value={form.partsUnitCost}
                        placeholder={payload?.serviceRequestOverride?.partsUnitCost?.toString() ||  payload?.serviceRequest?.partsUnitCost?.toString() || ""}
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
                        placeholder={payload?.serviceRequestOverride?.numberOfParts?.toString() ||  payload?.serviceRequest?.numberOfParts?.toString() || ""}
                        onChange={handleChange}
                        type="number"
                        inputProps={{min: 1}}
                    />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose} color="info">Cancel</Button>
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