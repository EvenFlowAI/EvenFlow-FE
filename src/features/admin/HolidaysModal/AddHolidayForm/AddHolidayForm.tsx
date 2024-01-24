import React from "react";
import {THolidayForm} from "../types";
import {FormControlLabel, Grid, Switch} from "@mui/material";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {useStyles} from "./styles";
import {TParsableDate} from "../../../../types/types";
import {CustomMobileDatePicker} from "../../../../components/pickers/CustomMobileDatePicker/CustomMobileDatePicker";

type TProps = {
    form: THolidayForm
    onDateChange: (date: TParsableDate) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCheck: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export const HolidayForm: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = props => {
    const classes = useStyles();
    return <div>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CustomMobileDatePicker
                    value={props.form.date}
                    onChange={props.onDateChange}
                    label="Date"
                    fullWidth
                    format="MMMM, DD"
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