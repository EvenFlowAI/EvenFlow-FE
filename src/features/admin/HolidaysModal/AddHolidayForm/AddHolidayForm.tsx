import React from "react";
import {THolidayForm} from "../types";
import {FormControlLabel, Grid, Switch} from "@mui/material";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {useStyles} from "./styles";
import {CustomDatePicker} from "../../../../components/pickers/DatePicker/CustomDatePicker";
import moment from "moment";

type TProps = {
    form: THolidayForm
    onDateChange: (date: moment.Moment) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCheck: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export const HolidayForm: React.FC<TProps> = props => {
    const classes = useStyles();
    return <div>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CustomDatePicker
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