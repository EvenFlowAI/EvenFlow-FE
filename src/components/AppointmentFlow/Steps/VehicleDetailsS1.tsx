import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Grid, IconButton, useMediaQuery, useTheme, withStyles} from "@material-ui/core";
import {
    InputLoading,
    Label,
    NextPrevBlock,
    ScrollableContainer,
    StepContainer,
    StepContentContainer,
    TextField,
    TStepProps
} from "../UI";
import {KeyboardDatePicker} from "@material-ui/pickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {changeS1Form} from "../../../store/reducers/appointment/actions";
import {Api} from "../../../config/requests";
import {useException} from "../../../utils/hooks";
import {IVehicleData} from "../../../store/reducers/appointment/types";
import {HelpOutline} from "@material-ui/icons";

const LabelGrid = withStyles((theme) => ({
    root: {
        textAlign: "right",
        [theme.breakpoints.down("xs")]: {
            textAlign: "left",
            position: "relative",
            top: 12
        }
    }
}))(Grid);

export const VehicleDetailsS1: React.FC<TStepProps> = ({next, prev, isCompleted}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const form = useSelector((state: RootState) => {
        return state.appointment.s1Data;
    });
    const showError = useException();
    const oldVin = useRef<string>("");
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    const fillDataByVin = useCallback((d: IVehicleData) => {
        dispatch(changeS1Form({
            ...d,
            year: d.year ? String(d.year) : form.year,
            mileage: d.mileage ? String(d.mileage) : form.mileage
        }));
    }, [dispatch, form]);

    useEffect(() => {
        if (form.vin.length === 17 && oldVin.current !== form.vin) {
            const t = setTimeout(() => {
                oldVin.current = form.vin;
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
        <StepContainer>
            <StepContentContainer>
                <h4 style={{textAlign: "center"}}>Please tell us about your vehicle</h4>
                <ScrollableContainer>
                    <Grid container spacing={2}>
                        <LabelGrid item xs={12} sm={3}>
                            <Label htmlFor="vin">
                                vehicle identification number (VIN)
                            </Label>
                        </LabelGrid>
                        <Grid item xs={11} sm={5}>
                            <TextField
                                id="vin"
                                name="vin"
                                InputProps={{
                                    endAdornment: loading ?
                                        <InputLoading/>
                                        : undefined
                                }}
                                value={form.vin}
                                onChange={handleTextChange}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="primary">
                                <HelpOutline />
                            </IconButton>
                        </Grid>
                        {!isXS ? <Grid item xs={3} /> : null}
                    </Grid>
                    <h4 style={{textAlign: "center", marginTop: 24}}>General info</h4>
                    <Grid container spacing={2} alignItems={"center"}>
                        <LabelGrid item xs={12} sm={3}>
                            <Label htmlFor="make">
                                make
                            </Label>
                        </LabelGrid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="make"
                                name="make"
                                value={form.make}
                                onChange={handleTextChange}
                            />
                        </Grid>
                        {!isXS ? <Grid item xs={3} /> : null}
                        <LabelGrid item xs={12} sm={3}>
                            <Label htmlFor="year">
                                year
                            </Label>
                        </LabelGrid>
                        <Grid item xs={12} sm={6}>
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
                        {!isXS ? <Grid item xs={12} sm={3} /> : null}
                        <LabelGrid item sm={3}>
                            <Label htmlFor="model">
                                model
                            </Label>
                        </LabelGrid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="model"
                                name="model"
                                value={form.model}
                                onChange={handleTextChange}
                            />
                        </Grid>
                        {!isXS ? <Grid item xs={3} /> : null}
                        <LabelGrid item xs={12} sm={3}>
                            <Label htmlFor="mileage">
                                mileage
                            </Label>
                        </LabelGrid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onChange={handleTextChange}
                                type={"number"}
                                value={form.mileage || ""}
                                name="mileage"
                                id="mileage"
                            />
                        </Grid>
                        {!isXS ? <Grid item xs={3} /> : null}
                    </Grid>
                    <h4 style={{textAlign: "center", marginTop: 24}}>Additional info</h4>
                    <Grid container spacing={2} alignItems={"center"}>
                        <LabelGrid item xs={12} sm={3}>
                            <Label htmlFor="transmission">
                                transmission
                            </Label>
                        </LabelGrid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="transmission"
                                name="transmission"
                                onChange={handleTextChange}
                                value={form.transmission}
                            />
                        </Grid>
                        {!isXS ? <Grid item xs={3} /> : null}
                        <LabelGrid item xs={12} sm={3}>
                            <Label htmlFor="driveType">
                                drive type
                            </Label>
                        </LabelGrid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="driveType"
                                name="driveType"
                                value={form.driveType}
                                onChange={handleTextChange}
                            />
                        </Grid>
                        {!isXS ? <Grid item xs={3} /> : null}
                        <LabelGrid item xs={12} sm={3}>
                            <Label htmlFor="engineType">
                                engine type
                            </Label>
                        </LabelGrid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="engineType"
                                name="engineType"
                                value={form.engineType}
                                onChange={handleTextChange}
                            />
                        </Grid>
                        {!isXS ? <Grid item xs={3} /> : null}
                    </Grid>
                </ScrollableContainer>
                <NextPrevBlock next={next} prev={prev} prevDisabled isCompleted={isCompleted} />
            </StepContentContainer>
        </StepContainer>
    );
};