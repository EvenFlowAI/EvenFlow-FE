import React, {useCallback, useEffect, useState} from 'react';
import {Button, Grid, withStyles} from "@material-ui/core";
import {InputLoading, Label, TextField, TStepProps} from "../UI";
import {KeyboardDatePicker} from "@material-ui/pickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {changeS1Form} from "../../../store/reducers/appointment/actions";
import {Api} from "../../../config/requests";
import {useException} from "../../../utils/hooks";
import {IVehicleData} from "../../../store/reducers/appointment/types";

const LabelGrid = withStyles({
    root: {
        textAlign: "right"
    }
})(Grid);

export const VehicleDetailsS1: React.FC<TStepProps> = ({next}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const form = useSelector((state: RootState) => {
        return state.appointment.s1Data;
    });
    const showError = useException();

    const fillDataByVin = useCallback((d: IVehicleData) => {
        dispatch(changeS1Form({
            ...d,
            year: d.year ? String(d.year) : null,
            mileage: d.mileage ? String(d.mileage) : null,
        }));
    }, [dispatch]);

    useEffect(() => {
        if (form.vin.length === 17) {
            const t = setTimeout(() => {
                setLoading(true);
                Api.call<IVehicleData>(
                    Api.endpoints.Vehicles.GetByVIN,
                    {params: {vin: form.vin}}
                )
                    .then(r => fillDataByVin(r.data))
                    .catch(e => showError(e))
                    .finally(() => setLoading(false));
            }, 1000);
            return () => clearTimeout(t);
        }
    }, [form.vin, showError, fillDataByVin]);

    const handleYearChange = (date: MaterialUiPickersDate) => {
        if (date && date.isValid()) {
            dispatch(changeS1Form({year: date.format("YYYY")}));
        }
    }
    const handleTextChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(changeS1Form({[name]: value}));
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
                        name="vin"
                        InputProps={{
                            endAdornment: loading ?
                                <InputLoading />
                                : undefined
                        }}
                        value={form.vin}
                        onChange={handleTextChange}
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
                        name="make"
                        value={form.make}
                        onChange={handleTextChange}
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
                            style: {fontWeight: "bold"},
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
                        name="model"
                        value={form.model}
                        onChange={handleTextChange}
                    />
                </Grid>
                <Grid item xs={3} />
                <LabelGrid item xs={3}>
                    <Label htmlFor="millage">
                        Mileage
                    </Label>
                </LabelGrid>
                <Grid item xs={6}>
                    <TextField
                        onChange={handleTextChange}
                        type={"number"}
                        value={form.mileage || ""}
                        name="mileage"
                        id="mileage"
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
                        name="transmission"
                        onChange={handleTextChange}
                        value={form.transmission}
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
                        name="driveType"
                        value={form.driveType}
                        onChange={handleTextChange}
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
                        name="engineType"
                        value={form.engineType}
                        onChange={handleTextChange}
                    />
                </Grid>
                <Grid item xs={3} />
            </Grid>
            <div style={{textAlign: "center", marginTop: 24}}>
                <Button variant="contained" onClick={next} color="primary">Continue</Button>
            </div>
        </div>
    );
};