import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {LoadingButton} from "../../../components/buttons/LoadingButton/LoadingButton";
import {useActionButtonsStyles} from "../../../hooks/styling/useActionButtonsStyles";
import {ETimeSlotType} from "../../../store/reducers/slotScoring/types";
import {Autocomplete, Grid, InputAdornment, Switch} from "@mui/material";
import {TextField} from "../../../components/formControls/TextFieldStyled/TextField";
import {TOption} from "../PodsTable/PODModal/types";
import {getOptions} from "../../../utils/utils";
import {autocompleteRender} from "../../../utils/autocompleteRenders";
import {Label, SubTitle} from "./styles";
import ClockTimePicker from "../../../components/pickers/ClockTimePicker/ClockTimePicker";
import {TParsableDate} from "../../../types/types";
import dayjs from "dayjs";
import {timeSpanString} from "../../../utils/constants";
import {TDayTime, TForm, TProps} from "./types";
import {daysList, initialForm} from "./constants";
import {SwitcherLabel, SwitcherWrapper} from "../EmployeesScheduleManagement/EmployeeScheduleModal/styles";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadCapacitySettingById} from "../../../store/reducers/capacityManagement/actions";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {ReactComponent as Time} from '../../../assets/img/time.svg';
import {ReactComponent as TimeDisabled} from '../../../assets/img/time_disabled.svg';
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";

const ServiceBookModal: React.FC<TProps> = ({open, onClose, editingItem}) => {
    const {currentSetting, isLoading} = useSelector((state: RootState) => state.capacityManagement)
    const {workingDays} = useSelector(({serviceCenters}: RootState) => serviceCenters)
    const [form, setForm] = useState<TForm>(initialForm)
    const {classes} = useActionButtonsStyles();
    const dispatch = useDispatch();
    const showError = useException();
    const {selectedSC} = useSCs();
    const gapSlotTypeOptions: TOption[] = useMemo(() => getOptions(Object.keys(ETimeSlotType).filter(key => Number.isNaN(+key))), []);

    useEffect(() => {
        if (editingItem && open && selectedSC) {
            dispatch(loadCapacitySettingById(selectedSC.id, editingItem.serviceBookId))
        }
    }, [editingItem, open, selectedSC])

    const setInitialData = useCallback(() => {
        if (currentSetting) setForm(() => {
            const {serviceBookName, advisorStaffingFactor, appointmentLeadTime, appointmentsPerSlot, technicianEfficiency, avarageBillHoursPerRO} = currentSetting;
            return {
                serviceBookName,
                appointmentLeadTime,
                appointmentsPerSlot,
                technicianEfficiency,
                avarageBillHoursPerRO,
                advisorStaffingFactor,
                cutOffTime: currentSetting.cutOffTime.map(el => ({day: el.day, time: el.value})),
                gapSlotsType: gapSlotTypeOptions.find(el => el.value === currentSetting.gapSlotsType) ?? null,
            }
        })
    }, [currentSetting, gapSlotTypeOptions])

    useEffect(() => {
        setInitialData()
    }, [currentSetting])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSelectGap = (e: React.ChangeEvent<{}>, val: TOption | null) => {
        setForm({...form, gapSlotsType: val});
    }

    const handleTimeChange = (day: number) => (date: TParsableDate) => {
        setForm(prev => {
            const itemToUpdate = prev.cutOffTime.find(el => el.day === day);
            if (itemToUpdate) {
                const updated = {...itemToUpdate, time: dayjs(date).format(timeSpanString)};
                const filtered = prev.cutOffTime.filter(el => el.day !== day)
                return {
                    ...prev,
                    cutOffTime: [...filtered, updated]
                        .sort((a, b) => a.day - b.day)}
            } else {
                const newItem:TDayTime = {day, time: dayjs(date).format(timeSpanString)}
                return {
                    ...prev,
                    cutOffTime: [...prev.cutOffTime, newItem]
                        .sort((a, b) => a.day - b.day)}
            }
        })
    }

    const handleSwitch = (e: any, value: boolean) => {
        setForm(prev => ({...prev, advisorStaffingFactor: value}))
    }

    const onCancel = () => {
        setInitialData()
        onClose()
    }

    const onSave = () => {}

    const onSuccess = () => {}

    const getDayLabel = (existingTime: TDayTime|undefined, day: number) => {
        return existingTime?.day
            ? dayjs().set('day', existingTime?.day).format('dddd')
            : dayjs().set('day', day).format('dddd')
    }

    // todo required fields: gap slot and name

    return (
        <BaseModal open={open} onClose={onCancel} width={550}>
            <DialogTitle onClose={onCancel}>Employee Time Schedule Set Up</DialogTitle>
            <DialogContent>
                {isLoading
                    ? <Loading/>
                    : <Grid container spacing={3}>
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
                            value={form.appointmentsPerSlot}
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
                    <Grid xs={12} item><SubTitle>Appointment Cut Off</SubTitle></Grid>
                    {daysList.map(day => {
                        const existingTime = form.cutOffTime.find(el => el.day === day);
                        return <Grid item xs={6} md={3}>
                            <ClockTimePicker
                                fullWidth
                                value={existingTime ? dayjs(existingTime.time, timeSpanString) : null}
                                label={getDayLabel(existingTime, day)}
                                InputProps={{
                                    placeholder: "",
                                    id: getDayLabel(existingTime, day),
                                    disabled: !workingDays.includes(day),
                                    endAdornment: workingDays.includes(day) ? <Time width={27}/> : <TimeDisabled width={27}/>,
                                    //error: !data.to && data.checked && formIsChecked,
                                }}
                                onChange={handleTimeChange(existingTime?.day ?? day)}
                            />
                        </Grid>
                    })}
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="technicianEfficiency"
                            name="technicianEfficiency"
                            label="Technician Efficiency"
                            placeholder="Type Efficiency, %"
                            fullWidth
                            type="number"
                            startAdornment={<InputAdornment position="start">%</InputAdornment>}
                            inputProps={{min: 0}}
                            onChange={handleChange}
                            value={form.technicianEfficiency}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="avarageBillHoursPerRO"
                            name="avarageBillHoursPerRO"
                            label="Average Bill Hours Per RO"
                            placeholder="Type Bill Hours"
                            fullWidth
                            type="number"
                            inputProps={{min: 0}}
                            onChange={handleChange}
                            value={form.avarageBillHoursPerRO}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Label>Advisor Staffing Factor</Label>
                        <SwitcherWrapper>
                            <SwitcherLabel>OFF</SwitcherLabel>
                            <Switch
                                onChange={handleSwitch}
                                checked={form.advisorStaffingFactor}
                                color="primary"
                            />
                            <SwitcherLabel>ON</SwitcherLabel>
                        </SwitcherWrapper>
                    </Grid>
                </Grid>
                }
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
                            Cancel
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