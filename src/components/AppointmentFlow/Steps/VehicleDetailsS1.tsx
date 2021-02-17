import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    ClickAwayListener,
    Grid,
    IconButton,
    styled,
    Tooltip,
    useMediaQuery,
    useTheme,
    withStyles
} from "@material-ui/core";
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
import {changeS1Form, setCustomerVehicle} from "../../../store/reducers/appointment/actions";
import {Api} from "../../../config/requests";
import {useException} from "../../../utils/hooks";
import {IVehicleData} from "../../../store/reducers/appointment/types";
import {Add, Help} from "@material-ui/icons";
import { VIN_LENGTH } from '../../../config/constants';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {ILoadedVehicle} from "../../../api/types";

const Tip = styled("p")({
    fontSize: 14,
    margin: 0,
    padding: 0
});

const TipIcon = () => {
    const [open, setOpen] = useState<boolean>(false);
    const handleClose = () => {
        setOpen(false);
    }
    return <ClickAwayListener onClickAway={handleClose}>
        <Tooltip open={open}
                    onClose={handleClose}
                    disableHoverListener
                    disableTouchListener
                    disableFocusListener
                    title={<Tip>
                        On most passenger cars, you may find the VIN number on the front of the dashboard on the driver's side.
                        The best way to see it is to look through the windshield from outside the car.
                        You may also find the VIN number on the driver's side door pillar.
                    </Tip>}>
            <IconButton color="primary" onClick={() => setOpen(true)}>
                <Help />
            </IconButton>
        </Tooltip>
    </ClickAwayListener>;
}

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
    const [addNewCar, setAddNewCar] = useState<boolean>(false);
    const dispatch = useDispatch();
    const form = useSelector((state: RootState) => {
        return state.appointment.s1Data;
    });
    const showError = useException();
    const oldVin = useRef<string>("");
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    const [customerLoadedData, selectedVehicle] = useSelector((state: RootState) => [
        state.appointment.customerLoadedData,
        state.appointment.customerSelectedVehicle
    ]);

    const fillDataByVin = useCallback((d: IVehicleData) => {
        dispatch(changeS1Form({
            ...d,
            year: d.year ? String(d.year) : form.year,
            mileage: d.mileage ? String(d.mileage) : form.mileage
        }));
    }, [dispatch, form]);

    useEffect(() => {
        if (form.vin.length === VIN_LENGTH && oldVin.current !== form.vin) {
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
    const handleVehicleChange = (e: any, value: ILoadedVehicle|null) => {
        dispatch(setCustomerVehicle(value));
    }
    const handleAddNewCar = () => {
        dispatch(setCustomerVehicle(null));
        setAddNewCar(true);
    }

    return (
        <StepContainer>
            <StepContentContainer>
                <h4 style={{textAlign: "center"}}>Please tell us about your vehicle</h4>
                <ScrollableContainer>
                    {
                        !addNewCar && customerLoadedData && customerLoadedData?.vehicles.length > 1
                            ? <Grid container spacing={2}>
                                <LabelGrid item xs={12} sm={3}>
                                    <Label htmlFor="vin">
                                        Select vehicle
                                    </Label>
                                </LabelGrid>
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        options={customerLoadedData?.vehicles}
                                        onChange={handleVehicleChange}
                                        getOptionLabel={option => option.vin}
                                        getOptionSelected={(option, value) => option.vin === value.vin}
                                        fullWidth
                                        autoComplete={true}
                                        renderInput={autocompleteRender({label: ""})}
                                        value={selectedVehicle}
                                    />
                                </Grid>
                                {!isXS
                                    ? <Grid item xs={3}>
                                        <IconButton color="primary" onClick={handleAddNewCar}>
                                            <Add />
                                        </IconButton>
                                    </Grid> : null}
                            </Grid>
                            : <Grid container spacing={2}>
                                <LabelGrid item xs={12} sm={3}>
                                    <Label htmlFor="vin">
                                        vehicle identification number (VIN)
                                    </Label>
                                </LabelGrid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="vin"
                                        name="vin"
                                        placeholder="e.g. 1HGBH41JXMN109186"
                                        InputProps={{
                                            endAdornment: loading ?
                                                <InputLoading/>
                                                : isXS ? <TipIcon/> : undefined
                                        }}
                                        value={form.vin}
                                        onChange={handleTextChange}
                                    />
                                </Grid>
                                {!isXS ? <>
                                    <Grid item xs={1}>
                                        <TipIcon/>
                                    </Grid>
                                    <Grid item xs={2}/>
                                </> : null}
                            </Grid>
                    }
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
                                placeholder="e.g. 110 456"
                                type={"number"}
                                inputProps={{min: 0}}
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