import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {DialogProps} from "../../Modals/types";
import {
    Button,
    Grid,
    MenuItem,
    Select,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage, useModal, useSCs} from "../../../utils/hooks";
import {TextField} from "../../UI/TextField";
import moment from "moment";
import {IEmployee} from "../../../store/reducers/employees/types";
import {ISchedule, IScheduleForm, IScheduleForWeek} from "../../../store/reducers/schedules/types";
import {TimePicker} from "../../UI/DateTimePickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {timeSpanString} from "../../../config/constants";
import {useDispatch, useSelector} from "react-redux";
import {loadEmployeesSchedule, setEmployeesSchedule} from "../../../store/reducers/schedules/actions";
import {RootState} from "../../../store/rootReducer";
import {CreateEmployee} from "../../Modals/CreateEmployee/CreateEmployee";
import {Close} from "@material-ui/icons";
import {API} from "../../../api/api";
import {TIds} from "./types";
import {Api} from "../../../config/requests";
import {getStartEndDates} from "./utils";
import {loadWorkingDays} from "../../../store/reducers/serviceCenters/actions";
import {loadWeeklyHolidaysList} from "../../../store/reducers/holidays/actions";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

type TProps = DialogProps<ISchedule> & {
    selectedDate: moment.Moment;
    date: moment.Moment;
    employee: IEmployee;
    onEmployeeUpdate: (id: string) => void;
    recursiveId?: number;
    customId?: number;
    onClear: (t: keyof TIds) => void;
}

type TForm = {
    timeStart: moment.Moment|null;
    timeEnd: moment.Moment|null;
    podId?: number;
}

const getRequestDate = (date: moment.Moment | ParsableDate): {fromDate: ParsableDate, toDate: ParsableDate} => {
    const dayOfWeek = moment(date).day();
    let fromDate = moment(date).day("Monday").toISOString();
    let toDate = moment(date).day("Friday").toISOString();
    if (dayOfWeek === 0) {
        fromDate = moment(date).subtract(1, 'day').startOf('week').add(1, 'day').toISOString()
        toDate = moment(date).subtract(1, 'day').day("Friday").toISOString()
    }
    return {fromDate, toDate};
}

export const EditSchedule: React.FC<TProps> = ({selectedDate, date, onClear, recursiveId, customId, employee, onEmployeeUpdate, onAction, payload, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [form, setForm] = useState<TForm>({timeStart: null, timeEnd: null});
    const [isCleared, setCleared] = useState<boolean>(false);
    const pods = useSelector((state: RootState) => state.pods.shortPodsList);

    const {isOpen, onClose, onOpen} = useModal();
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    const theme = useTheme();
    const {selectedSC} = useSCs();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

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
        props.onClose();
    }

    const handleUpdate = (name: keyof TForm) => (date: MaterialUiPickersDate) => {
        setForm({...form, [name]: moment(date)});
    }
    const handleSelectPod = (e: React.ChangeEvent<{value: unknown, name?: string}>) => {
        setForm({...form, podId: e.target.value ? Number(e.target.value) : undefined});
    }

    const handleClear = (t: keyof TIds) => async () => {
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

    const handleSave = (isRecurring: boolean) => async () => {
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

    const handleSetForWeek = useCallback(() => {
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
    }, [employee, form, date, getRequestDate, getStartEndDates, selectedDate, isXS, showError, handleClose, setSaving])

    return <BaseModal {...props} width={750} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>Edit employee schedule</DialogTitle>
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
                    <TimePicker
                        value={form.timeStart}
                        label="Starts at"
                        fullWidth
                        onChange={handleUpdate("timeStart")}
                        id="timeStart"
                        name="timeStart"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TimePicker
                        value={form.timeEnd}
                        label="Finishes at"
                        fullWidth
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
                Set for {date.format("MMM, DD YYYY")}
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