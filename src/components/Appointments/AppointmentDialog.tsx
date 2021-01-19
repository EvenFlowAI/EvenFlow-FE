import React, {useEffect, useState} from 'react';
import {DialogProps} from "../Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../Modals/BaseModal";
import {IListAppointment} from "../../api/types";
import {Button, Checkbox, Divider, FormControlLabel, Grid} from "@material-ui/core";
import {LoadingButton} from "../UI/Button";
import {useException, useMessage, useSCs} from "../../utils/hooks";
import {EReminderType, ISR} from "../../store/reducers/appointment/types";
import {TextField} from "../UI/TextField";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../UI/AutocompleteRender";
import {DatePicker} from "../UI/DateTimePickers";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {API} from "../../api/api";

type TForm = {
    date: string;
    slot: string;
    reminderTypes: EReminderType[];
    driverName: string;
    driverPhoneNumber: string;
    driverEmail: string;
    transportationNeeded: boolean;
    transportationDescription: string;
    vehicleVin: string;
    vehicleMake: string;
    vehicleYear: string;
    vehicleModel: string;
    vehicleMileage: string;
    vehicleTransmission: string;
    vehicleDriveType: string;
    vehicleEngineType: string;
    isNeedCall: boolean;
    comment: string;
    serviceRequestIds: number[];
};
const initialForm: TForm = {
    date: "string",
    slot: "",
    reminderTypes: [],
    driverName: "",
    driverPhoneNumber: "",
    driverEmail: "",
    transportationDescription: "",
    transportationNeeded: false,
    vehicleVin: "",
    vehicleMake: "",
    vehicleYear: "",
    vehicleModel: "",
    vehicleMileage: "",
    vehicleTransmission: "",
    vehicleDriveType: "",
    vehicleEngineType: "",
    isNeedCall: false,
    comment: "",
    serviceRequestIds: [],
};
export const AppointmentDialog: React.FC<DialogProps<IListAppointment>> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [filterDate, setDate] = useState<ParsableDate>("");
    const [srList, setSrList] = useState<ISR[]>([]);
    const [srLoading, setSrLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const showError = useException();
    const showMessage = useMessage();
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (props.open) {
            setForm(initialForm);
        }
    }, [props.open]);

    useEffect(() => {
        if (props.open && selectedSC) {
            setSrLoading(true);
            API.serviceRequests.list(selectedSC.id, "")
                .then(({data: {result}}) => {
                    setSrList(result);
                })
                .catch(() => {
                    setSrList([]);
                })
                .finally(() => setSrLoading(false));
        }
    }, [selectedSC, props.open])

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
        setForm({...form, [name]: value});
    }

    const handleSave = async () => {
        setLoading(true);
        try {
            setLoading(false);
            showMessage("Saved");
            onAction && onAction();
            props.onClose();
        } catch (e) {
            setLoading(false);
            showError(e);
        }
    }

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>{!payload ? "Add" : "Update"} Appointment</DialogTitle>
        <DialogContent>
            <Grid alignItems="center" container spacing={2}>
                <Grid item xs={12}>
                    <h3>Driver info</h3>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Driver name"
                        id="driverName"
                        name="driverName"
                        fullWidth
                        onChange={handleChange}
                        value={form.driverName}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Driver email"
                        value={form.driverEmail}
                        id="driverEmail"
                        name="driverEmail"
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Phone number"
                        value={form.driverPhoneNumber}
                        id="driverPhoneNumber"
                        name="driverPhoneNumber"
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <h3>Vehicle info</h3>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="VIN"
                        value={form.vehicleVin}
                        id="vehicleVin"
                        name="vehicleVin"
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        label="Make"
                        value={form.vehicleMake}
                        id="vehicleMake"
                        name="vehicleMake"
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        label="Model"
                        value={form.vehicleModel}
                        id="vehicleModel"
                        name="vehicleModel"
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <TextField
                        label="Year"
                        value={form.vehicleYear}
                        id="vehicleYear"
                        name="vehicleYear"
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Drive Type"
                        value={form.vehicleDriveType}
                        id="vehicleDriveType"
                        name="vehicleDriveType"
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Engine Type"
                        value={form.vehicleEngineType}
                        id="vehicleEngineType"
                        name="vehicleEngineType"
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Mileage"
                        value={form.vehicleMileage}
                        id="vehicleMileage"
                        type="number"
                        inputProps={{min: 0, step: 1000}}
                        name="vehicleMileage"
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        multiple
                        ChipProps={{
                            color: "primary",
                            style: {borderRadius: 4},
                            size: "small"
                        }}
                        loading={srLoading}
                        getOptionSelected={(o, s) => o.id === s.id}
                        getOptionLabel={(option) => `${option.code}: ${option.description}`}
                        renderInput={autocompleteRender({label: "Service Requests"})}
                        options={srList}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <DatePicker
                        value={filterDate || null}
                        onChange={setDate}
                        label="Date"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Autocomplete
                        multiple
                        renderInput={autocompleteRender({label: "Time slot"})}
                        options={[]}
                    />
                </Grid>
                <Grid item xs={12} sm={3} style={{alignSelf: "flex-end"}}>
                    Price: -
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TextField
                        label="Transportation Description"
                        value={form.transportationDescription}
                        id="transportationDescription"
                        name="transportationDescription"
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={4} style={{alignSelf: "flex-end"}}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={form.transportationNeeded}
                                onChange={(e, checked) =>
                                    setForm({...form, transportationNeeded: checked})}
                            />
                        }
                        label="Transportation"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Comment"
                        value={form.comment}
                        id="comment"
                        name="comment"
                        rows={3}
                        multiline
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
                Cancel
            </Button>
            <LoadingButton
                loading={loading}
                onClick={handleSave}
            >
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};