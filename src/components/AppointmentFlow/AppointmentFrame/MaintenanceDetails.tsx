import React, {useEffect, useMemo, useState} from 'react';
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {styled, useMediaQuery, useTheme} from "@material-ui/core";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {TActionProps} from "./types";
import {useDispatch, useSelector} from "react-redux";
import {TMaintenanceDetails} from "../../../store/reducers/appointmentFrameReducer/types";
import {
    setMaintenanceDetails,
    updateVehicle
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {RootState} from "../../../store/rootReducer";
import {Api} from "../../../config/requests";
import {useParams} from "react-router-dom";
import {ILoadedVehicle} from "../../../api/types";
import moment from "moment";
import {TextField} from "../../UI/TextField";
import {useException} from "../../../utils/hooks";
import {decodeSCID} from "../../../utils/utils";
import {IMake} from "../../../store/reducers/appointment/types";

const SelectWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr"
    }
}));

type TSelect = {
    label: string;
    name: keyof TMaintenanceDetails | keyof ILoadedVehicle;
    options?: string[]|string;
    noVehicle?: boolean;
    allOverride?: boolean;
};


export const mileageOptions: string[] = [
    "3000",
    "5000",
    "10000",
    "15000",
    "25000",
    "30000",
    "40000",
    "50000",
    "60000",
    "70000",
    "80000",
    "90000",
    "100000",
];

const year = moment.utc().year();
const YEARS = 20;
export const yearOptions: string[] = Array(YEARS).fill(0).map((_, idx) => String(year - idx));

const selects: TSelect[] = [
    {label: "VIN", name: "vin", noVehicle: true},
    {label: "Make", name: "make", options: 'make'},
    {label: "Year", name: "year", options: yearOptions},
    {label: "Model", name: "model", options: "model",},
    // {label: "Trim", name: "trim", options: ["All"], allOverride: true},
    // {label: "Powertrain", name: "powertrain", options: ["All"], allOverride: true},
    // {label: "Oil Type", name:"oilType", options: ["All"], allOverride: true},
    {label: "Estimated mileage", name:"serviceInterval", options: mileageOptions},
];

const requiredFields: TKey[] = [
    "model", "year", "make", "serviceInterval"
];

type TOptionsState = {[s: string]: string[]};
const blankOptions: TOptionsState = {};

type TKey = keyof TMaintenanceDetails | keyof ILoadedVehicle;

export const MaintenanceDetails: React.FC<TActionProps> = ({onNext, onBack}) => {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState<TKey[]>([]);
    const [loadedOptions, setLoadedOptions] = useState<TOptionsState>(blankOptions);
    const [models, setModels] = useState<string[] | []>([]);
    const {id} = useParams();
    const maintenanceDetails = useSelector((state: RootState) => state.appointmentFrame.maintenanceDetails);
    const selectedVehicle = useSelector((state: RootState) => state.appointmentFrame.selectedVehicle);
    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    const showError = useException();

    const isNewVehicleView = useMemo(() => {
        return !Boolean(customerLoadedData?.vehicles.find(v => v.vin === selectedVehicle?.vin));
    }, [selectedVehicle, customerLoadedData]);

    useEffect(() => {
        if (selectedVehicle) {
            dispatch(setMaintenanceDetails({
                make: selectedVehicle.make,
                model: selectedVehicle.model,
                year: selectedVehicle.year ? String(selectedVehicle.year) : undefined,
            }));
        }
    }, [dispatch, selectedVehicle]);

    useEffect(() => {
        if (models.length) {
            setLoadedOptions(prevOptions => ({...prevOptions, model: models}));
        }
    }, [models])

    useEffect(() => {
        Api.call<string[]>(
            Api.endpoints.Vehicles.Models,
            {params: {serviceCenterId: decodeSCID(id)}}
        ).then(({data}) => {
            if (!data?.length) {
                setModels(['Other']);
            }
            setModels(data);
        }).catch(() => {
            setModels(['Other']);
        })

        Api.call<IMake[]>(
            Api.endpoints.Vehicles.Makes,
            {params: {serviceCenterId: decodeSCID(id)}}
        ).then(({data}) => {
            if (!data?.length) {
                setLoadedOptions(prevOptions => ({...prevOptions, make: ['Other']}));
            }
            setLoadedOptions(prevOptions => ({...prevOptions, make: data.map(item => item.name)}));
        }).catch(() => {
            setLoadedOptions(prevOptions => ({...prevOptions, make: ['Other']}));
        })
    }, [id]);

    const handleChange = (name: TKey, skip?: boolean) => (e: React.ChangeEvent<{}>, option: string|null) => {
        if (isXS) e.preventDefault();
        if (option && !skip) {
            dispatch(setMaintenanceDetails({[name]: option ?? null}));
            if (["year", "model", "make", "serviceInterval"].includes(name)) {
                dispatch(updateVehicle({[name]: option}))
            }
            setErrors(e => e.filter(err => err !== name));
            if (name === 'make') {
                if (option === 'Other') {
                    setLoadedOptions(prevOptions => ({...prevOptions, model: ['Other']}));
                    if (selectedVehicle?.model) dispatch(updateVehicle({model: ''}));
                } else {
                    setLoadedOptions(prevOptions => ({...prevOptions, model: models }));
                }
            }
        }
    }

    const handleTextChange = (name: TKey) => ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateVehicle({[name]: value.trim()}));
        if (name === "model") {
            dispatch(setMaintenanceDetails({[name]: value.trim()}));
        }
        setErrors(e => e.filter(err => err !== name));
    }

    const isValid = () => {
        const errorsArray: string [] = [];
        for (let f of requiredFields) {
            if (!selectedVehicle || (!selectedVehicle[f as keyof ILoadedVehicle])) {
                setErrors(e => [...e, f]);
                if (f === "serviceInterval") {
                    errorsArray.push("estimated Mileage");
                } else {
                    errorsArray.push(f);
                }
            }
        }

        if (errorsArray.length) {
            const fields = errorsArray.map((error) => error[0].toUpperCase() + error.slice(1));
            const message = fields.join(', ').concat(fields.length < 2 ? ' is' : ' are').concat(' required');
            showError(message);
        }
        return !errorsArray.length;
    }

    const handleNext = () => {
        if (isValid()) {
            onNext();
        }
    }

    return (<StepWrapper>
        <SelectWrapper>
            {selects.map(select => {
                if (!isNewVehicleView && select.noVehicle) {
                    return null;
                }
                const hasError = errors.includes(select.name);
                if (select.options) {
                    return <Autocomplete
                        key={select.name}
                        options={typeof select.options === 'string'
                            ? loadedOptions[select.options] ?? []
                            : select.options}
                        onChange={handleChange(select.name, select.allOverride)}
                        fullWidth
                        disableClearable
                        autoComplete={true}
                        disabled={select.name !== 'serviceInterval' && !isNewVehicleView}
                        renderInput={autocompleteRender({
                            label: select.label,
                            placeholder: hasError ? `${select.label} required` : `Select ${select.label}`,
                            error: hasError,
                            required: requiredFields.includes(select.name)
                        })}
                        value={!select.allOverride
                            ? maintenanceDetails[select.name as keyof TMaintenanceDetails] ?? ""
                            : "All"
                        }
                    />
                }
                return <div key={select.name}>
                    <TextField
                        onChange={handleTextChange(select.name)}
                        label={select.label}
                        name={select.name}
                        error={hasError}
                        required={requiredFields.includes(select.name)}
                        fullWidth
                        disabled={select.name !== 'serviceInterval' && !isNewVehicleView}
                        value={selectedVehicle ? selectedVehicle[select.name as keyof ILoadedVehicle] : ""}
                        placeholder={hasError
                            ? `${select.label} required`
                            : `Type ${select.label} ${select.name === 'vin' ? '(Optional)' : ''}`}
                    />
                </div>
            })}
        </SelectWrapper>
        <Actions onBack={onBack} onNext={handleNext} />
    </StepWrapper>);
};