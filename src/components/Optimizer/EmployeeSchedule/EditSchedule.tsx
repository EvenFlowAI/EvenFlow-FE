import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {DialogProps} from "../../Modals/types";
import {Button, Grid} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage} from "../../../utils/hooks";
import {TextField} from "../../UI/TextField";
import moment from "moment";
import {IEmployee} from "../../../store/reducers/employees/types";
import {ISchedule, IScheduleForm} from "../../../store/reducers/schedules/types";
import {TimePicker} from "../../UI/DateTimePickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {timeSpanString} from "../../../config/constants";
import {useDispatch} from "react-redux";
import {setEmployeesSchedule} from "../../../store/reducers/schedules/actions";

type TProps = DialogProps<ISchedule> & {
    date: moment.Moment;
    employee: IEmployee;
}
type TForm = {
    timeStart: moment.Moment|null;
    timeEnd: moment.Moment|null;
}
export const EditSchedule: React.FC<TProps> = ({date, employee, onAction, payload, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [timePeriod, setTimePeriod] = useState<TForm>({timeStart: null, timeEnd: null});
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.open) {
            if (payload) {
                setTimePeriod({
                    timeStart: moment(payload.startAt, timeSpanString),
                    timeEnd: moment(payload.finishAt, timeSpanString)
                });
            } else {
                setTimePeriod({timeStart: null, timeEnd: null});
            }
        }
    }, [props.open, payload]);

    const handleUpdate = (name: keyof TForm) => (date: MaterialUiPickersDate) => {
        setTimePeriod({...timePeriod, [name]: moment(date)});
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            const data: IScheduleForm = {
                ...payload,
                date: date.toISOString(),
                employeeId: employee.id,
                startAt: timePeriod.timeStart?.format(timeSpanString),
                finishAt: timePeriod.timeEnd?.format(timeSpanString),
                serviceCenterId: employee.serviceCenterId
            }
            await dispatch(setEmployeesSchedule(data));
            setSaving(false);
            showMessage("Saved");
            props.onClose();
        } catch (e) {
            setSaving(false);
            showError(e);
        }
    }

    return <BaseModal {...props} width={400}>
        <DialogTitle onClose={props.onClose}>Edit employee schedule</DialogTitle>
        <DialogContent>
            <Grid container spacing={2}>
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
                        value={timePeriod.timeStart}
                        label="Starts at"
                        fullWidth
                        onChange={handleUpdate("timeStart")}
                        id="timeStart"
                        name="timeStart"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TimePicker
                        value={timePeriod.timeEnd}
                        label="Finishes at"
                        fullWidth
                        onChange={handleUpdate("timeEnd")}
                        id="timeEnd"
                        name="timeEnd"
                    />
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
    </BaseModal>
};