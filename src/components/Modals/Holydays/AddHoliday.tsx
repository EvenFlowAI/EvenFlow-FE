import React, {useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, FormControlLabel, Grid, Switch} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {makeStyles} from "@material-ui/core/styles";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {DateTimePicker} from "../../UI/DateTimePickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import moment from "moment";

const useStyles = makeStyles(theme => ({
    label: {
        "& .MuiFormControlLabel-label": {
            fontWeight: "bold",
            textTransform: "uppercase"
        }
    },
    spacer: {
        padding: 12
    },
    preview: {
        border: `1px solid ${theme.palette.text.primary}`,
        textAlign: "center",
        padding: 10,
        fontSize: 16,
        fontWeight: "bold"
    }
}));

const HForm: React.FC<{
    form: TForm
    onDateChange: (f: "startDate" | "endDate") => (date: MaterialUiPickersDate) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCheck: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}> = props => {
    const classes = useStyles();
    return <div>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <DateTimePicker
                    value={props.form.startDate}
                    onChange={props.onDateChange("startDate")}
                    label="Start Date"
                    fullWidth
                />
            </Grid>
            <Grid item xs={6}>
                <DateTimePicker
                    value={props.form.endDate}
                    onChange={props.onDateChange("endDate")}
                    label="End Date"
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    className={classes.label}
                    control={
                        <Switch
                            name="isAllDay"
                            onChange={props.onCheck}
                            checked={props.form.isAllDay}
                            color="primary" />
                    }
                    label="All day" />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    className={classes.label}
                    control={
                        <Switch
                            name="isRecurring"
                            onChange={props.onCheck}
                            checked={props.form.isRecurring}
                            color="primary" />
                    }
                    label="Recurring" />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Description title"
                    value={props.form.description}
                    onChange={props.onChange}
                    name="description"
                    id="description"
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} className={classes.spacer} />
            <Grid item xs={12}>
                {props.form.startDate && props.form.endDate ? <div className={classes.preview}>
                    From {moment(props.form.startDate).format("MMM D, H:mm a")} to {moment(props.form.endDate).format("MMM D, H:mm a")}
                </div> : null}
            </Grid>
        </Grid>
    </div>
}
type TForm = {
    startDate: ParsableDate;
    endDate: ParsableDate;
    isAllDay: boolean;
    isRecurring: boolean;
    description: string;
};
const initialForm: TForm = {
    startDate: null,
    endDate: null,
    isAllDay: true,
    isRecurring: false,
    description: ""
}
export const AddHoliday: React.FC<DialogProps> = ({onAction, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }
    const handleDateChange = (f: "startDate" | "endDate") => (date: MaterialUiPickersDate) => {
        setForm({...form, [f]: date});
    }
    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setForm({...form, [e.target.name]: checked});
    }

    const handleSave = () => {
        if (!selectedSC) {
            showError("Service center is not selected");
        } else {
            if (onAction) {
                onAction();
            }
        }
    }
    return <BaseModal {...props} width={600}>
        <DialogTitle onClose={props.onClose}>Add New Holiday</DialogTitle>
        <DialogContent>
            <HForm
                onChange={handleChange}
                form={form}
                onCheck={handleCheck}
                onDateChange={handleDateChange}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
    </BaseModal>
}