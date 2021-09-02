import React, {useEffect, useMemo, useState} from 'react';
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {styled} from "@material-ui/core";
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
import {EVehiclePropType, ILoadedVehicle} from "../../../api/types";
import moment from "moment";
import {TextField} from "../../UI/TextField";
import {VIN_LENGTH} from "../../../config/constants";
import {useException} from "../../../utils/hooks";

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


const mileageOptions: string[] = [
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
const yearOptions: string[] = Array(YEARS).fill(0).map((_, idx) => String(year - idx));

type TTypeNameList = [EVehiclePropType, keyof TMaintenanceDetails];

const selects: TSelect[] = [
    {label: "VIN", name: "vin", noVehicle: true},
    {label: "Make", name: "make", noVehicle: true},
    {label: "Year", name: "year", options: yearOptions},
    {label: "Model", name: "model", options: "model",},
    {label: "Trim", name: "trim", options: ["All"], allOverride: true},
    {label: "Powertrain", name: "powertrain", options: ["All"], allOverride: true},
    {label: "Oil Type", name:"oilType", options: ["All"], allOverride: true},
    {label: "Estimated mileage", name:"serviceInterval", options: mileageOptions},
];

const requiredFields: TKey[] = [
    "model", "year", "make"
];

type TOptionsState = {[s: string]: string[]};
const blankOptions: TOptionsState = {};

type TKey = keyof TMaintenanceDetails | keyof ILoadedVehicle;

export const MaintenanceDetails: React.FC<TActionProps> = ({onNext, onBack}) => {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState<TKey[]>([]);
    const [loadedOptions, setLoadedOptions] = useState<TOptionsState>(blankOptions);
    const {id} = useParams();
    const maintenanceDetails = useSelector((state: RootState) => state.appointmentFrame.maintenanceDetails);
    const selectedVehicle = useSelector((state: RootState) => state.appointmentFrame.selectedVehicle);
    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);

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
        Api.call<string[]>(
            Api.endpoints.Vehicles.Models
        ).then(({data}) => {
            setLoadedOptions({model: data});
        })
    }, [id, maintenanceDetails]);

    const handleChange = (name: TKey, skip?: boolean) => (e: React.ChangeEvent<{}>, option: string|null) => {
        if (option && !skip) {
            dispatch(setMaintenanceDetails({[name]: option ?? null}));
            if (isNewVehicleView && ["year", "model"].includes(name)) {
                dispatch(updateVehicle({[name]: option}))
            }
            setErrors(e => e.filter(err => err !== name));
        }
    }

    const handleTextChange = (name: TKey) => ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateVehicle({[name]: value}));
        if (name === "model") {
            dispatch(setMaintenanceDetails({[name]: value}));
        }
        setErrors(e => e.filter(err => err !== name));
    }

    const isValid = () => {
        let error: string = "";
        if (selectedVehicle?.vin.length !== VIN_LENGTH) {
            setErrors(e => [...e, "vin"]);
            error = "VIN";
        }
        for (let f of requiredFields) {
            if (!selectedVehicle || (!selectedVehicle[f as keyof ILoadedVehicle])) {
                setErrors(e => [...e, f]);
                error = f;
            }
        }
        if (!maintenanceDetails.serviceInterval) {
            setErrors(e => [...e, "serviceInterval"]);
            error = "estimated Mileage"
        }
        if (error) {
            showError(`${error[0].toUpperCase() + error.slice(1)} is required`);
        }
        return !error;
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
                        renderInput={autocompleteRender({
                            label: select.label, placeholder: hasError ? `${select.label} is required` : `Select ${select.label}`, error: hasError
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
                        fullWidth
                        value={selectedVehicle ? selectedVehicle[select.name as keyof ILoadedVehicle] : ""}
                        placeholder={hasError ? `${select.label} required` : `Type ${select.label}`}
                    />
                </div>
            })}
        </SelectWrapper>
        <Actions onBack={onBack} onNext={handleNext} />
    </StepWrapper>);
};