import React, {useEffect, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {styled} from "@material-ui/core";
import {IVehicle} from "../../../store/reducers/appointment/types";
import moment from "moment";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {updateVehicle} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TextField} from "../../UI/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {ILoadedVehicle} from "../../../api/types";
import {Api} from "../../../config/requests";
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
    name: keyof IVehicle;
    options?: string|string[];
};

const year = moment.utc().year();
const YEARS = 20;
const yearOptions: string[] = Array(YEARS).fill(0).map((_, idx) => String(year - idx));

const selects: TSelect[] = [
    {label: "VIN", name: "vin"},
    {label: "Make", name: "make"},
    {label: "Year", name: "year", options: yearOptions},
    {label: "Model", name: "model", options: "model"},
    {label: "Mileage", name:"mileage"},
    {label: "Transmission", name: "transmission"},
    {label: "Drive Type", name: "driveType"},
    {label: "Engine Type", name: "engineType"},
];

type TOptionsState = {[s: string]: string[]};
const blankOptions: TOptionsState = {};

type TVehicleKey = keyof IVehicle;

const requiredFields: TVehicleKey[] = [
    "make", "year", "model", "mileage"
];

type TProps = {} & TActionProps;
export const CarDetails: React.FC<TProps> = ({onBack, onNext}) => {
    const [loadedOptions, setLoadedOptions] = useState<TOptionsState>(blankOptions);
    const [errors, setErrors] = useState<TVehicleKey[]>([]);

    const showError = useException();

    const dispatch = useDispatch();

    const selectedVehicle = useSelector((state: RootState) => state.appointmentFrame.selectedVehicle);

    useEffect(() => {
        Api.call<string[]>(
            Api.endpoints.Vehicles.Models
        ).then(({data}) => {
            setLoadedOptions({model: data});
        })
    }, []);

    const handleChange = (name: keyof IVehicle) =>
        (e: React.ChangeEvent<{}>, option: string|number|object|null) => {
        if (option) {
            dispatch(updateVehicle({[name]: option}));
            setErrors(e => e.filter(err => err !== name));
        }
    }
    const handleTextChange = (name: keyof IVehicle) =>
        ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateVehicle({[name]: value}));
        if (value) {
            setErrors(e => e.filter(err => err !== name));
        }
    }

    const isValid = (): boolean => {
        let error: string = "";
        for (let f of requiredFields) {
            if (!selectedVehicle || !selectedVehicle[f as keyof ILoadedVehicle]) {
                setErrors(e => [...e, f]);
                error = f;
            }
        }
        if (error) {
            showError(`${error[0].toUpperCase() + error.slice(1)} required`);
        }
        return !error;
    }

    const handleNext = () => {
        if (isValid()) {
            onNext();
        }
    }

    return <StepWrapper>
        <SelectWrapper>
            {selects.map(select => {
                const hasError = errors.includes(select.name);
                if (select.options) {
                    return <Autocomplete
                        key={select.name}
                        options={typeof select.options === 'string'
                            ? loadedOptions[select.options] ?? []
                            : select.options ?? []}
                        onChange={handleChange(select.name)}
                        fullWidth
                        autoComplete={true}
                        renderInput={autocompleteRender({
                            label: select.label, placeholder: `Select ${select.label}`, error: hasError
                        })}
                        value={selectedVehicle ? selectedVehicle[select.name as keyof ILoadedVehicle] : null}
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
    </StepWrapper>
};