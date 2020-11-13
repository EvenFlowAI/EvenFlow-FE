import React from 'react';
import {Button, Grid, withStyles} from "@material-ui/core";
import {Label, TextField} from "../UI";
import {KeyboardDatePicker} from "@material-ui/pickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {changeS1Form} from "../../../store/reducers/appointment/actions";

const LabelGrid = withStyles({
    root: {
        textAlign: "right"
    }
})(Grid);

export const VehicleDetailsS1 = () => {
    const dispatch = useDispatch();
    const form = useSelector((state: RootState) => {
        return state.appointment.s1Data;
    })
    const handleYearChange = (date: MaterialUiPickersDate) => {
        if (date && date.isValid()) {
            dispatch(changeS1Form({year: date.format("YYYY")}));
        }
    }

    return (
        <div style={{width: "100%"}}>
            <h4 style={{textAlign: "center"}}>Please tell us about your vehicle</h4>
            <Grid container spacing={2}>
                <LabelGrid item xs={3}>
                    <Label htmlFor="vin">
                        vehicle identification number (VIN)
                    </Label>
                </LabelGrid>
                <Grid item xs={6}>
                    <TextField
                        id="vin"
                    />
                </Grid>
                <Grid item xs={3} />
            </Grid>
            <h4 style={{textAlign: "center", marginTop: 24}}>General info</h4>
            <Grid container spacing={2} alignItems={"center"}>
                <LabelGrid item xs={3}>
                    <Label htmlFor="make">
                        make
                    </Label>
                </LabelGrid>
                <Grid item xs={6}>
                    <TextField
                        id="make"
                    />
                </Grid>
                <Grid item xs={3} />
                <LabelGrid item xs={3}>
                    <Label htmlFor="year">
                        year
                    </Label>
                </LabelGrid>
                <Grid item xs={6}>
                    <KeyboardDatePicker
                        value={form.year}
                        id="year"
                        views={["year"]}
                        allowKeyboardControl
                        disableFuture
                        fullWidth
                        onChange={handleYearChange}
                        InputProps={{
                            disableUnderline: true
                        }}
                    />
                </Grid>
                <Grid item xs={3} />
                <LabelGrid item xs={3}>
                    <Label htmlFor="model">
                        model
                    </Label>
                </LabelGrid>
                <Grid item xs={6}>
                    <TextField
                        id="model"
                    />
                </Grid>
                <Grid item xs={3} />
                <LabelGrid item xs={3}>
                    <Label htmlFor="millage">
                        millage
                    </Label>
                </LabelGrid>
                <Grid item xs={6}>
                    <TextField
                        id="millage"
                    />
                </Grid>
                <Grid item xs={3} />
            </Grid>
            <h4 style={{textAlign: "center", marginTop: 24}}>Additional info</h4>
            <Grid container spacing={2} alignItems={"center"}>
                <LabelGrid item xs={3}>
                    <Label htmlFor="transmission">
                        transmission
                    </Label>
                </LabelGrid>
                <Grid item xs={6}>
                    <TextField
                        id="transmission"
                    />
                </Grid>
                <Grid item xs={3} />
                <LabelGrid item xs={3}>
                    <Label htmlFor="driveType">
                        drive type
                    </Label>
                </LabelGrid>
                <Grid item xs={6}>
                    <TextField
                        id="driveType"
                    />
                </Grid>
                <Grid item xs={3} />
                <LabelGrid item xs={3}>
                    <Label htmlFor="engineType">
                        engine type
                    </Label>
                </LabelGrid>
                <Grid item xs={6}>
                    <TextField
                        id="engineType"
                    />
                </Grid>
                <Grid item xs={3} />
            </Grid>
            <div style={{textAlign: "center", marginTop: 24}}>
                <Button variant="contained" color="primary">Continue</Button>
            </div>
        </div>
    );
};