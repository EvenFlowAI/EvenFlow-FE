import React, {useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {LoadingButton} from "../../../components/buttons/LoadingButton/LoadingButton";
import {useActionButtonsStyles} from "../../../hooks/styling/useActionButtonsStyles";
import {ETimeSlotType} from "../../../store/reducers/slotScoring/types";
import {Autocomplete, Grid} from "@mui/material";
import {TextField} from "../../../components/formControls/TextFieldStyled/TextField";
import {TOption} from "../PodsTable/PODModal/types";
import {getOptions} from "../../../utils/utils";
import {autocompleteRender} from "../../../utils/autocompleteRenders";
import {SubTitle} from "./styles";
import ClockTimePicker from "../../../components/pickers/ClockTimePicker/ClockTimePicker";
import {TParsableDate} from "../../../types/types";
import dayjs from "dayjs";
import {timeSpanString} from "../../../utils/constants";
import {TDayTime, TForm, TProps} from "./types";
import {daysList, initialForm} from "./constants";

const ServiceBookModal: React.FC<TProps> = ({open, onClose, editingItem}) => {
    const [form, setForm] = useState<TForm>(initialForm)
    const {classes} = useActionButtonsStyles();
    const gapSlotTypeOptions: TOption[] = useMemo(() => getOptions(Object.keys(ETimeSlotType).filter(key => Number.isNaN(+key))), []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSelectGap = (e: React.ChangeEvent<{}>, val: TOption | null) => {
        setForm({...form, gapSlotsType: val});
    }

    const handleTimeChange = (day: string) => (date: TParsableDate) => {
        setForm(prev => {
            const itemToUpdate = prev.cutOffTime.find(el => el.day === day);
            if (itemToUpdate) {
                const updated = {...itemToUpdate, time: dayjs(date).format(timeSpanString)};
                const filtered = prev.cutOffTime.filter(el => el.day !== day)
                return {
                    ...prev,
                    cutOffTime: [...filtered, updated]
                        .sort((a, b) => dayjs(a.day, 'dddd').day() - dayjs(b.day, 'dddd').day())}
            } else {
                const newItem:TDayTime = {day, time: dayjs(date).format(timeSpanString)}
                return {
                    ...prev,
                    cutOffTime: [...prev.cutOffTime, newItem]
                        .sort((a, b) => dayjs(a.day, 'dddd').day() - dayjs(b.day, 'dddd').day())}
            }
        })
    }

    const onCancel = () => {}

    const onSave = () => {}

    return (
        <BaseModal open={open} onClose={onCancel} width={500}>
            <DialogTitle onClose={onCancel}>Employee Time Schedule Set Up</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            id="serviceBookName"
                            name="serviceBookName"
                            label="Service Book Name"
                            placeholder="Type Name"
                            fullWidth
                            onChange={handleChange}
                            value={form.serviceBookName}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            id="gapSlotsType"
                            fullWidth
                            getOptionLabel={o => o.name}
                            onChange={handleSelectGap}
                            value={form.gapSlotsType}
                            isOptionEqualToValue={(o, v) => o === v}
                            options={gapSlotTypeOptions}
                            renderInput={autocompleteRender({
                                label: "Appointment Gap Slots",
                                placeholder: 'Appointment Gap Slots'
                            })}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="appointmentsPerSlot"
                            name="appointmentPerSlots"
                            label="Appointments Per Slot"
                            placeholder="Type Amount"
                            fullWidth
                            type="number"
                            inputProps={{min: 0}}
                            onChange={handleChange}
                            value={form.appointmentPerSlots}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="appointmentLeadTime"
                            name="appointmentLeadTime"
                            label="Appointment Lead Time"
                            placeholder="Type Time"
                            fullWidth
                            type="number"
                            inputProps={{min: 0}}
                            onChange={handleChange}
                            value={form.appointmentLeadTime}
                        />
                    </Grid>
                    <Grid xs={12}><SubTitle>Appointment Cut Off</SubTitle></Grid>
                    {daysList.map(day => {
                        const existingTime = form.cutOffTime.find(el => dayjs(el.day, 'dddd').day() === day);
                        return <Grid item xs={6} md={3}>
                            <ClockTimePicker
                                fullWidth
                                value={existingTime ? dayjs(existingTime.time, timeSpanString) : null}
                                InputProps={{
                                    placeholder: "",
                                    label: existingTime?.day ?? dayjs(day).format('dddd'),
                                    id: existingTime?.day ?? dayjs(day).format('dddd'),
                                    // disabled: !data.checked || viewMode || isLoading,
                                    //error: !data.to && data.checked && formIsChecked,
                                }}
                                onChange={handleTimeChange(existingTime?.day ?? dayjs(day).format('dddd'))}
                            />
                        </Grid>
                    })}
                    {form.cutOffTime.map(el => (
                        <Grid item xs={6} md={3}>
                            <ClockTimePicker
                                fullWidth
                                value={dayjs(el.time, timeSpanString)}
                                InputProps={{
                                    placeholder: "",
                                    label: el.day,
                                    id: el.day,
                                    // disabled: !data.checked || viewMode || isLoading,
                                    //error: !data.to && data.checked && formIsChecked,
                                }}
                                onChange={handleTimeChange(el.day)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <div className={classes.wrapper}>
                    <div className={classes.buttonsWrapper}>
                        <LoadingButton
                            // loading={loading || employeesLoading}
                            onClick={onCancel}
                            variant="text"
                            style={{marginRight: 20}}
                            color="info">
                            Close
                        </LoadingButton>
                        <LoadingButton
                            // loading={loading || employeesLoading}
                            onClick={onSave}
                            className={classes.saveButton}>
                            Save
                        </LoadingButton>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default ServiceBookModal;