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


type TForm = {
    description: string;
    durationInHours: string;
    countOfTechnicians: string;
    skillLevelOfTechnicians: number;
    invoiceAmount: string;
    warrantyInvoiceAmount: string;
}
const initialForm: TForm = {
    description: "",
    durationInHours: "",
    countOfTechnicians: "",
    skillLevelOfTechnicians: 0,
    invoiceAmount: "",
    warrantyInvoiceAmount: "",
};
export const OverrideOPsCodeDialog: React.FC<DialogProps<IAssignedServiceRequest>> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [isLoading, setLoading] = useState<boolean>(false);
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.open && payload?.serviceRequestOverride) {
            const override = payload.serviceRequestOverride
            setForm({
                ...initialForm,
                description: override?.description || "",
                countOfTechnicians: override?.countOfTechnicians?.toString() || "",
                durationInHours: override?.durationInHours?.toString() || "",
                invoiceAmount: override?.invoiceAmount?.toString() || "",
                warrantyInvoiceAmount: override?.warrantyInvoiceAmount?.toString() || "",
                skillLevelOfTechnicians: override?.skillLevelOfTechnicians || 0
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
                showError(e);
            }
        }
    }

    return <BaseModal {...props} maxWidth="xs">
        <DialogTitle onClose={props.onClose}>Edit Service Request</DialogTitle>
        <DialogContent>
            <Grid container spacing={3}>
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
                        placeholder={payload ? String(payload.serviceRequest.invoiceAmount) : ""}
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