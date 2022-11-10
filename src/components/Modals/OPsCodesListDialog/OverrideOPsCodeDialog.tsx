import React, {useEffect, useState} from "react";
import {DialogProps} from "../types";
import {
    IAssignedServiceRequest, IServiceRequestOverride,
    IServiceRequestOverrideEditRequest
} from "../../../store/reducers/serviceRequests/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Grid} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage} from "../../../utils/hooks";
import {useDispatch} from "react-redux";
import {updateAssignedServiceRequest} from "../../../store/reducers/serviceRequests/actions";
import {ToggleButtons} from "../../UI/ToggleButtons";

type TForm = {
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
    description: "",
    durationInHours: "",
    countOfTechnicians: "",
    skillLevelOfTechnicians: 0,
    invoiceAmount: "",
    warrantyInvoiceAmount: "",
    partsUnitCost: "",
    numberOfParts: "",
};
export const OverrideOPsCodeDialog: React.FC<DialogProps<IAssignedServiceRequest>> = ({onAction, payload, ...props}) => {
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

    const handleLevelChange = (e: any, val: number) => {
        setForm({...form, skillLevelOfTechnicians: val});
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
                    payload.serviceCenterId
                ));
                setLoading(false);
                showMessage("Saved");
                props.onClose();
            } catch (e) {
                setLoading(false);
                showError(e);
            }
        }
    }

    return <BaseModal {...props} maxWidth="xs">
        <DialogTitle onClose={props.onClose}>Edit Service Request</DialogTitle>
        <DialogContent>
            <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={12}>
                    <TextField
                        label="Service Ops Code name"
                        disabled
                        fullWidth
                        value={payload?.serviceRequest.code || ""}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Service description"
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
                        label="Duration (hours)"
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
                    <TextField
                        fullWidth
                        label="Number of technicians"
                        name="countOfTechnicians"
                        id="countOfTechnicians"
                        autoComplete="technicians-count"
                        value={form.countOfTechnicians}
                        placeholder={payload ? String(payload.serviceRequest.countOfTechnicians) : ""}
                        onChange={handleChange}
                        type="number"
                        inputProps={{min: 1}}
                    />
                </Grid>
                <Grid item xs={12}>
                    <ToggleButtons
                        value={form.skillLevelOfTechnicians}
                        label="Technician Level"
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
                        label="Invoice Amount"
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
                        label="Parts Unit Cost"
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