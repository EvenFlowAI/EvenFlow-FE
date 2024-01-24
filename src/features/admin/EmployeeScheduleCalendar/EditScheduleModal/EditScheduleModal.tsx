import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {
    Button,
    Grid,
    MenuItem,
    Select, SelectChangeEvent,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import moment from "moment";
import {IEmployee} from "../../../../store/reducers/employees/types";
import {ISchedule, IScheduleForm, IScheduleForWeek} from "../../../../store/reducers/schedules/types";
import {timeSpanString} from "../../../../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import {loadEmployeesSchedule, setEmployeesSchedule} from "../../../../store/reducers/schedules/actions";
import {RootState} from "../../../../store/rootReducer";
import {CreateEmployee} from "../../../../components/modals/admin/CreateEmployee/CreateEmployee";
import {Close, QueryBuilder} from "@mui/icons-material";
import {API} from "../../../../api/api";
import {TIds} from "../types";
import {getRequestDate} from "../utils";
import {loadWorkingDays} from "../../../../store/reducers/serviceCenters/actions";
import {loadWeeklyHolidaysList} from "../../../../store/reducers/holidays/actions";
import {getStartEndDates} from "../../../../utils/utils";
import {TForm} from "./types";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";
import {useModal} from "../../../../hooks/useModal/useModal";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {Api} from "../../../../api/ApiEndpoints/ApiEndpoints";
import dayjs from "dayjs";
import ClockTimePicker from "../../../../components/pickers/ClockTimePicker/ClockTimePicker";
import {TParsableDate} from "../../../../types/types";

type TProps = DialogProps<ISchedule> & {
    selectedDate: moment.Moment;
    date: moment.Moment;
    employee: IEmployee;
    onEmployeeUpdate: (id: string) => void;
    recursiveId?: number;
    customId?: number;
    onClear: (t: keyof TIds) => void;
}

export const EditScheduleModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({selectedDate, date, onClear, recursiveId, customId, employee, onEmployeeUpdate, onAction, payload, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [form, setForm] = useState<TForm>({timeStart: null, timeEnd: null});
    const [isCleared, setCleared] = useState<boolean>(false);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const pods = useSelector((state: RootState) => state.pods.shortPodsList);

    const {isOpen, onClose, onOpen} = useModal();
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    const theme = useTheme();
    const {selectedSC} = useSCs();
    const isXS = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        selectedSC && dispatch(loadWorkingDays(selectedSC.id))
        dispatch(loadWeeklyHolidaysList(moment().startOf('week'), moment().endOf('week')))
    }, [selectedSC])

    useEffect(() => {
        if (props.open) {
            if (payload) {
                setForm({
                    timeStart: moment(payload.startAt, timeSpanString),
                    timeEnd: moment(payload.finishAt, timeSpanString),
                    podId: payload.podId,
                });
            } else {
                setForm({timeStart: null, timeEnd: null});
            }
        }
    }, [props.open, payload]);

    const handleClose = () => {
        setCleared(false);
        setFormIsChecked(false);
        props.onClose();
    }

    const handleUpdate = (name: keyof TForm) => (date: TParsableDate) => {
        setFormIsChecked(false);
        setForm({...form, [name]: moment(dayjs(date).toDate())});
    }
    const handleSelectPod = (e: SelectChangeEvent<number>) => {
        setFormIsChecked(false);
        setForm({...form, podId: e.target.value ? Number(e.target.value) : undefined});
    }

    const handleClear = (t: keyof TIds) => async () => {
        setFormIsChecked(false);
        setSaving(true);
        try {
            await API.employeeSchedules.remove((t === "customId" ? customId : recursiveId) || 0);
            await setCleared(true);
            onClear(t);
        } catch (e) {
            showError(e);
        } finally {
            setSaving(false);
        }
    }

    const checkIsValid = (): boolean => {
        let err: string[] = [];
        if (!form.timeEnd || !form.timeStart) {
            if (!form.timeStart) err = [...err, '"Starts At" must not be empty'];
            if (!form.timeEnd) err = [...err, '"Finishes At" must not be empty'];
        } else {
            if (form.timeStart?.diff(form.timeEnd) >=0) err = [...err, '"Starts At" must be less than "Finishes At"']
        }
        err.map(e => showError(e));
        return !Boolean(err.length)
    }

    const handleSave = (isRecurring: boolean) => async () => {
        setFormIsChecked(true);
        if (checkIsValid()) {
            setSaving(true);
            try {
                const data: IScheduleForm = {
                    ...payload,
                    date: date.toISOString(),
                    employeeId: employee.id,
                    startAt: form.timeStart?.format(timeSpanString),
                    finishAt: form.timeEnd?.format(timeSpanString),
                    serviceCenterId: employee.serviceCenterId,
                    podId: form.podId,
                    isRecurring,
                    id: isRecurring ? recursiveId : customId
                }
                await dispatch(setEmployeesSchedule(data, isXS));
                setSaving(false);
                showMessage("Saved");
                handleClose();
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    const handleSetForWeek = useCallback(() => {
        setFormIsChecked(true);
        if (checkIsValid()) {
            setSaving(true);
            const data: IScheduleForWeek = {
                serviceCenterId: employee.serviceCenterId,
                employeeId: employee.id,
                startAt: form.timeStart?.format(timeSpanString),
                finishAt: form.timeEnd?.format(timeSpanString),
                podId: form.podId,
                status: 0,
                ...getRequestDate(date),
            }

            Api.call(Api.endpoints.EmployeeSchedule.SetForWeek, {data})
                .then(() => {
                    const [start, end] = getStartEndDates(selectedDate, isXS);
                    dispatch(loadEmployeesSchedule(start, end, employee.serviceCenterId));
                })
                .catch(err => {
                    showError(err);
                })
                .finally(() => {
                    setSaving(false);
                    handleClose();
                })
        }
    }, [employee, form, date, getRequestDate, getStartEndDates, selectedDate, isXS, showError, handleClose, setSaving])

    return <BaseModal {...props} width={750} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>Edit Employee Schedule</DialogTitle>
        <DialogContent>
            <Grid container alignItems="flex-end" spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Employee full name"
                        fullWidth
                        disabled
                        value={employee.fullName}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Date"
                        fullWidth
                        disabled
                        value={date.format("MMM D, YYYY")}
                    />
                </Grid>
                <Grid item xs={6}>
                    <ClockTimePicker
                        value={dayjs(form.timeStart?.toDate())}
                        label="Starts at"
                        fullWidth
                        onChange={handleUpdate("timeStart")}
                        InputProps={{
                            endAdornment: <QueryBuilder color={"disabled"} cursor="pointer"/>
                        }}
                        error={!form.timeStart && formIsChecked}
                        id="timeStart"
                        name="timeStart"
                    />
                </Grid>
                <Grid item xs={6}>
                    <ClockTimePicker
                        value={dayjs(form.timeEnd?.toDate())}
                        InputProps={{
                            endAdornment: <QueryBuilder color={"disabled"} cursor="pointer"/>
                        }}
                        label="Finishes at"
                        fullWidth
                        error={!form.timeEnd && formIsChecked}
                        onChange={handleUpdate("timeEnd")}
                        id="timeEnd"
                        name="timeEnd"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Select
                        fullWidth
                        onChange={handleSelectPod}
                        input={<TextField label="Pod" />}
                        value={form.podId||0}
                    >
                        <MenuItem value={0}>-</MenuItem>
                        {pods.map(pod => {
                            return <MenuItem key={pod.id} value={pod.id}>{pod.name}</MenuItem>
                        })}
                    </Select>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        style={{marginBottom: 3}}
                        fullWidth
                        color="primary"
                        onClick={onOpen}>
                        Employee Profile
                    </Button>
                </Grid>
                {payload && !isCleared
                    ? <Grid item xs={12}>
                    {payload?.isRecurring ? <LoadingButton
                        color="secondary"
                        variant="outlined"
                        onClick={handleClear("recursiveId")}
                        startIcon={<Close />}>
                        Clear schedule for {date.format("dddd")}
                    </LoadingButton> : <LoadingButton
                        onClick={handleClear("customId")}
                        startIcon={<Close />}
                        variant="outlined"
                        color="secondary">
                        Clear schedule for {date.format("MMM D, YYYY")}
                    </LoadingButton>}
                </Grid>
                    : null}
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <LoadingButton
                loading={saving}
                onClick={handleSave(false)}
            >
                Set for {date.format("MMM DD, YYYY")}
            </LoadingButton>
            <LoadingButton
                loading={saving}
                onClick={handleSave(true)}
            >
                Set for {date.format("dddd")}
            </LoadingButton>
            <LoadingButton
                loading={saving}
                onClick={handleSetForWeek}
            >
                Set for week
            </LoadingButton>
        </DialogActions>
        <CreateEmployee open={isOpen} payload={employee} onAction={() => onEmployeeUpdate(employee.id)} onClose={onClose} />
    </BaseModal>
};