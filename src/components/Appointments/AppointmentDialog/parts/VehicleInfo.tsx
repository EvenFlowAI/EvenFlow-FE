import React, {useEffect, useState, Dispatch, SetStateAction} from 'react';
import {Grid} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../UI/AutocompleteRender";
import {TextField} from "../../../UI/TextField";
import {InputLoading} from "../../../AppointmentFlow/UI";
import {yearOptions} from "../../../AppointmentFlow/AppointmentFrame/MaintenanceDetails";
import {IVehicleDetails} from "../../../../store/reducers/appointments/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {TForm} from "../AppointmentDialog";

type TSelect = {
    label: string;
    name: keyof IVehicleDetails;
    options?: string[]|string;
};

type TOptionsState = {[s: string]: string[]};
const blankOptions: TOptionsState = {};

type TKey = keyof IVehicleDetails;

type TVehicleInfoProps = {
    errors: TKey[];
    setErrors: Dispatch<SetStateAction<TKey[]>>;
    setForm: Dispatch<SetStateAction<TForm>>;
    form: TForm;
    vinLoading: boolean;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
}

const VehicleInfo: React.FC<TVehicleInfoProps> = ({ errors, setErrors, setForm, form, vinLoading, handleChange }) => {
    const {makes}= useSelector((state: RootState) => state.appointmentFrame);
    const {mileage} = useSelector((state: RootState) => state.vehicleDetails);
    const [loadedOptions, setLoadedOptions] = useState<TOptionsState>(blankOptions);

    const selects: TSelect[] = [
        {label: "VIN", name: "vehicleVin"},
        {label: "Make", name: "vehicleMake", options: 'make'},
        {label: "Model", name: "vehicleModel", options: "model",},
        {label: "Year", name: "vehicleYear", options: yearOptions},
        {label: "Mileage", name:"vehicleMileage", options: mileage.map(item => item.value.toString())},
    ];

    useEffect(() => {
        if (makes.length) {
            setLoadedOptions(prevOptions => ({...prevOptions, make: makes.map(item => item.name)}));
        } else {
            setLoadedOptions(prevOptions => ({...prevOptions, make: ['Other']}));
        }
    }, [makes])

    const handleSelectChange = (name: TKey, skip?: boolean) => (e: React.ChangeEvent<{}>, option: string|null) => {
        if (option && !skip) {
            setErrors(e => e.filter(err => err !== name));
            if (name === 'vehicleMake') {
                if (option === 'Other') {
                    setLoadedOptions(prevOptions => ({...prevOptions, model: ['Other']}));
                    setForm(prev => ({...prev, vehicleModel: 'Other', [name]: option}));
                } else {
                    const currentMake = makes.find(item => item.name === option);
                    if (currentMake) setLoadedOptions(prevOptions => ({...prevOptions, model: currentMake.models }));
                    setForm(prev => ({...prev, vehicleModel: ""}))
                }
            }
            setForm(prev => ({...prev, [name]: option}));
        }
    }

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <h3>Vehicle info</h3>
            </Grid>
            {selects.map(select => {
                    const hasError = errors.includes(select.name);
                    if (select.options) {
                        return <Grid item xs={12}  sm={6}>
                            <Autocomplete
                                key={select.name}
                                options={typeof select.options === 'string'
                                    ? loadedOptions[select.options] ?? []
                                    : select.options}
                                onChange={handleSelectChange(select.name)}
                                disableClearable
                                autoComplete={true}
                                renderInput={autocompleteRender({
                                    label: select.label,
                                    placeholder: hasError ? `${select.label} required` : `Select ${select.label}`,
                                    error: hasError,
                                    required: true
                                })}
                                value={form[select.name]}
                            />
                        </Grid>
                    } else {
                        return <Grid item xs={12}>
                            <TextField
                                label="VIN"
                                value={form.vehicleVin}
                                id="vehicleVin"
                                name="vehicleVin"
                                placeholder="Enter VIN"
                                endAdornment={
                                    vinLoading ?
                                        <InputLoading />
                                        : undefined
                                }
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                    }
                }
            )}
        </React.Fragment>
    );
};

export default VehicleInfo;