import React, {useEffect, useState, Dispatch, SetStateAction, useCallback} from 'react';
import {Grid} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../UI/AutocompleteRender";
import {TextField} from "../../../UI/TextField";
import {InputLoading} from "../../../AppointmentFlow/UI";
import {yearOptions} from "../../../AppointmentFlow/AppointmentFrame/MaintenanceDetails";
import {IVehicleDetails} from "../../../../store/reducers/appointments/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {TForm, TKey} from "../types";
import {useSCs} from "../../../../utils/hooks";
import {loadPackageByVehicle} from "../../../../store/reducers/appointments/actions";
import {IEngineType} from "../../../../store/reducers/vehicleDetails/types";

type TSelect = {
    label: string;
    name: keyof IVehicleDetails;
    options?: string[]|string;
};

type TOptionsState = {[s: string]: string[]};
const blankOptions: TOptionsState = {};

type TVehicleInfoProps = {
    errors: string[];
    setErrors: Dispatch<SetStateAction<string[]>>;
    setForm: Dispatch<SetStateAction<TForm>>;
    form: TForm;
    vinLoading: boolean;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
    isDataValid: boolean;
    onVehicleDetailsChange: () => void;
    selectedEngine: IEngineType|null;
    setSelectedEngine: Dispatch<SetStateAction<IEngineType|null>>;
}

const VehicleInfo: React.FC<TVehicleInfoProps> = ({ selectedEngine, setSelectedEngine, onVehicleDetailsChange, errors, setErrors, setForm, form, vinLoading, handleChange, isDataValid }) => {
    const {makes}= useSelector((state: RootState) => state.appointmentFrame);
    const {mileage, engineTypes} = useSelector((state: RootState) => state.vehicleDetails);
    const [loadedOptions, setLoadedOptions] = useState<TOptionsState>(blankOptions);
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    const selects: TSelect[] = [
        {label: "VIN", name: "vehicleVin"},
        {label: "Make", name: "vehicleMake", options: 'make'},
        {label: "Year", name: "vehicleYear", options: yearOptions},
        {label: "Model", name: "vehicleModel", options: "model",},
        {label: "Mileage", name:"vehicleMileage", options: mileage.map(item => item.value.toString())},
    ];

    useEffect(() => {
        if (makes.length) {
            setLoadedOptions(prevOptions => ({...prevOptions, make: makes.map(item => item.name)}));
        } else {
            setLoadedOptions(prevOptions => ({...prevOptions, make: ['Other']}));
        }
    }, [makes])

    useEffect(() => {
        if (selectedSC && isDataValid) getPackage();
    }, [selectedSC, isDataValid, form.vehicleMake, form.vehicleModel, form.vehicleYear, form.vehicleMileage, selectedEngine])

    useEffect(() => {
        if (!form.vehicleMake?.length && selectedSC) {
            const defaultMake = makes.find(item => item.id === selectedSC.defaultVehicleMakeId)
            defaultMake && setForm(prev => ({...prev, vehicleMake: defaultMake.name}))
        }
    }, [makes, form, selectedSC])

    const handleSelectChange = useCallback((name: TKey, skip?: boolean) => (e: React.ChangeEvent<{}>, option: string|null) => {
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
            onVehicleDetailsChange();
        }
    }, [makes, onVehicleDetailsChange])

    const getPackage = useCallback(() => {
        if (selectedSC && isDataValid) {
            dispatch(loadPackageByVehicle({
                serviceCenterId: selectedSC.id,
                vehicle: {
                    vin: form.vehicleVin,
                    make: form.vehicleMake,
                    model: form.vehicleModel,
                    mileage: +form.vehicleMileage,
                    year: +form.vehicleYear,
                    engineTypeId: selectedEngine?.id ?? null,
                }
            }))
        }
    }, [selectedSC, isDataValid, dispatch, form, selectedEngine])

    const onEngineTypeChange =  (e: React.ChangeEvent<{}>, option: IEngineType|null) => {
        setSelectedEngine(option)
        onVehicleDetailsChange();
        setForm(prev => ({...prev, vehicleEngineTypeId: option?.id ?? null}))
        setErrors(e => e.filter(err => err !== "engineTypeId"))
    }

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <h3>Vehicle info</h3>
            </Grid>
            {selects.map(select => {
                    const hasError = errors.includes(select.name);
                    if (select.options) {
                        return <Grid key={select.name} item xs={12} sm={6}>
                            <Autocomplete
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
                        return <Grid item xs={12} key={select.name}>
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
            <Grid item xs={12} key="engineType">
                <Autocomplete
                    key="Engine Type"
                    options={engineTypes}
                    onChange={onEngineTypeChange}
                    fullWidth
                    getOptionLabel={o => o.name}
                    getOptionSelected={o => o.id === selectedEngine?.id}
                    disableClearable
                    autoComplete={true}
                    renderInput={autocompleteRender({
                        label: "Engine Type",
                        placeholder: errors.includes("engineTypeId") ? "EngineType required" : "Select Engine Type",
                        error: errors.includes("engineTypeId"),
                        required: true,
                    })}
                    value={selectedEngine ?? undefined}
                />
            </Grid>
        </React.Fragment>
    );
};

export default VehicleInfo;