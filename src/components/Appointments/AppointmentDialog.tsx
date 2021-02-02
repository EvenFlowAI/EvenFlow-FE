import React, {useEffect, useState} from 'react';
import {DialogProps} from "../Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../Modals/BaseModal";
import {ICreateAppointment, IListAppointment} from "../../api/types";
import {Button, Checkbox, Divider, FormControlLabel, Grid} from "@material-ui/core";
import {LoadingButton} from "../UI/Button";
import {useException, useMessage, useSCs} from "../../utils/hooks";
import {EAppointmentTimingType, EReminderType, IAppointmentSlot, ISR} from "../../store/reducers/appointment/types";
import {TextField} from "../UI/TextField";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../UI/AutocompleteRender";
import {DatePicker} from "../UI/DateTimePickers";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {API} from "../../api/api";
import moment from "moment";
import {timeSpanString, timeString} from "../../config/constants";
import {CalendarToday} from "@material-ui/icons";

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
    const [selectedSR, setSelectedSR] = useState<ISR[]>([]);
    const [srLoading, setSrLoading] = useState<boolean>(false);
    const [slots, setSlots] = useState<IAppointmentSlot[]>([]);
    const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
    const [selectedSlot, setSelectedSlot] = useState<IAppointmentSlot|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const showError = useException();
    const showMessage = useMessage();
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (props.open) {
            setForm(initialForm);
            setSelectedSR([]);
            setDate("");
            setSelectedSlot(null);
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
                .finally(() => {
                    setSrLoading(false);
                });
        }
    }, [selectedSC, props.open]);
    useEffect(() => {
        if (selectedSC && props.open && selectedSR.length && filterDate) {
            setSlotsLoading(true);
            API.timeSlots.list({
                appointmentTimingType: EAppointmentTimingType.PreferredDate,
                fromDate: moment(filterDate).toISOString(),
                serviceRequestIds: selectedSR.map(sr => sr.id),
                serviceCenterId: selectedSC.id
            })
                .then(({data: {items}}) => {
                    setSlots(items);
                    setSelectedSlot(null)
                })
                .catch((e) => {
                    showError(e);
                    setSlots([]);
                    setSelectedSlot(null);
                })
                .finally(() => {
                    setSlotsLoading(false);
                });

        }
    }, [selectedSC, props.open, filterDate, selectedSR, showError]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
        setForm({...form, [name]: value});
    }
    const handleSRChange = (e: any, value: ISR[]) => {
        setSelectedSR(value);
    }
    const handleSlotChange = (e: any, value: IAppointmentSlot|null) => {
        setSelectedSlot(value);
    }

    const handleSave = async () => {
        if (!selectedSC) {
            return;
        }
        setLoading(true);
        try {
            const data: ICreateAppointment = {
                serviceRequestIds: selectedSR.map(sr => sr.id),
                slot: selectedSlot?.time || "",
                date: selectedSlot?.date,
                transportationNeeds: {
                    description: form.transportationDescription,
                    isNeed: form.transportationNeeded
                },
                vehicle: {
                    make: form.vehicleMake,
                    model: form.vehicleModel,
                    year: form.vehicleYear,
                    driveType: form.vehicleDriveType,
                    engineType: form.vehicleEngineType,
                    mileage: form.vehicleMileage,
                    transmission: form.vehicleTransmission,
                    vin: form.vehicleVin
                },
                serviceCenterId: selectedSC.id,
                isNeedCall: form.isNeedCall,
                gmt: moment().utcOffset(),
                offerId: selectedSlot?.offer?.id || null,
                driver: {
                    email: form.driverEmail,
                    phoneNumber: form.driverPhoneNumber,
                    fullName: form.driverName
                },
                comment: form.comment,
                reminderTypes: [],
                appointmentTimingType: EAppointmentTimingType.PreferredDate
            }
            await API.appointment.create(data);
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
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Drive Type"
                        value={form.vehicleDriveType}
                        id="vehicleDriveType"
                        name="vehicleDriveType"
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Transmission"
                        value={form.vehicleTransmission}
                        id="vehicleTransmission"
                        name="vehicleTransmission"
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Engine Type"
                        value={form.vehicleEngineType}
                        id="vehicleEngineType"
                        name="vehicleEngineType"
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
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
                        onChange={handleSRChange}
                        value={selectedSR}
                        ChipProps={{
                            color: "primary",
                            style: {borderRadius: 4},
                            size: "small"
                        }}
                        loading={srLoading}
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
                        InputProps={{
                            endAdornment: <CalendarToday />
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Autocomplete
                        loading={slotsLoading}
                        value={selectedSlot}
                        getOptionLabel={option =>
                            `${moment(option.date).format("LL")} ${moment(option.time, timeSpanString).format(timeString)} - $${
                                option.priceWithOffer?.value ? option.priceWithOffer.value.toFixed(2) : option.price.value.toFixed(2)
                            }`
                        }
                        onChange={handleSlotChange}
                        renderInput={autocompleteRender({label: "Time slot"})}
                        options={slots}
                    />
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