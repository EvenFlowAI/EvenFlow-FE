import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {DialogProps} from "../../Modals/types";
import {Button, Grid, MenuItem, Select, useMediaQuery, useTheme} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage, useModal} from "../../../utils/hooks";
import {TextField} from "../../UI/TextField";
import moment from "moment";
import {IEmployee} from "../../../store/reducers/employees/types";
import {ISchedule, IScheduleForm} from "../../../store/reducers/schedules/types";
import {TimePicker} from "../../UI/DateTimePickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {timeSpanString} from "../../../config/constants";
import {useDispatch, useSelector} from "react-redux";
import {setEmployeesSchedule} from "../../../store/reducers/schedules/actions";
import {RootState} from "../../../store/rootReducer";
import {CreateEmployee} from "../../Modals/CreateEmployee/CreateEmployee";

type TProps = DialogProps<ISchedule> & {
    date: moment.Moment;
    employee: IEmployee;
    onEmployeeUpdate: (id: string) => void
}
type TForm = {
    timeStart: moment.Moment|null;
    timeEnd: moment.Moment|null;
    podId?: number;
}
export const EditSchedule: React.FC<TProps> = ({date, employee, onEmployeeUpdate, onAction, payload, ...props}) => {
    const {isOpen, onClose, onOpen} = useModal();
    const [saving, setSaving] = useState<boolean>(false);
    const [form, setForm] = useState<TForm>({timeStart: null, timeEnd: null});
    const pods = useSelector((state: RootState) => state.pods.shortPodsList);
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    useEffect(() => {
        if (props.open) {
            if (payload) {
                setForm({
                    timeStart: moment(payload.startAt, timeSpanString),
                    timeEnd: moment(payload.finishAt, timeSpanString)
                });
            } else {
                setForm({timeStart: null, timeEnd: null});
            }
        }
    }, [props.open, payload]);

    const handleUpdate = (name: keyof TForm) => (date: MaterialUiPickersDate) => {
        setForm({...form, [name]: moment(date)});
    }
    const handleSelectPod = (e: React.ChangeEvent<{value: unknown, name?: string}>) => {
        setForm({...form, podId: e.target.value ? Number(e.target.value) : undefined});
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            const data: IScheduleForm = {
                ...payload,
                date: date.toISOString(),
                employeeId: employee.id,
                startAt: form.timeStart?.format(timeSpanString),
                finishAt: form.timeEnd?.format(timeSpanString),
                serviceCenterId: employee.serviceCenterId,
                podId: form.podId
            }
            await dispatch(setEmployeesSchedule(data, isXS));
            setSaving(false);
            showMessage("Saved");
            props.onClose();
        } catch (e) {
            setSaving(false);
            showError(e);
        }
    }

    return <BaseModal {...props} width={500}>
        <DialogTitle onClose={props.onClose}>Edit employee schedule</DialogTitle>
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
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <LoadingButton
                loading={saving}
                onClick={handleSave}
            >
                Save
            </LoadingButton>
        </DialogActions>
        <CreateEmployee open={isOpen} payload={employee} onAction={() => onEmployeeUpdate(employee.id)} onClose={onClose} />
    </BaseModal>
};