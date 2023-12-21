import React from "react";
import {THolidayForm} from "../types";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {FormControlLabel, Grid, Switch} from "@material-ui/core";
import {TextField} from "../../../../components/FormControls/TextFieldStyled/TextField";
import {useStyles} from "./styles";
import {DatePicker} from "../../../../components/DatePicker/DatePicker";

type TProps = {
    form: THolidayForm
    onDateChange: (date: MaterialUiPickersDate) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCheck: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export const HolidayForm: React.FC<TProps> = props => {
    const classes = useStyles();
    return <div>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <DatePicker
                    value={props.form.date}
                    onChange={props.onDateChange}
                    label="Date"
                    fullWidth
                />
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
        </Grid>
    </div>
}