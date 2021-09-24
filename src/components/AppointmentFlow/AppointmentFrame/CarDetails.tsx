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
import {decodeSCID} from "../../../utils/utils";
import {useParams} from "react-router-dom";

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
    {label: "Make", name: "make", options: 'make'},
    {label: "Year", name: "year", options: yearOptions},
    {label: "Model", name: "model", options: "model"},
    {label: "Estimated Mileage", name:"mileage"},
    // {label: "Transmission", name: "transmission"},
    // {label: "Drive Type", name: "driveType"},
    // {label: "Engine Type", name: "engineType"},
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
    const {id} = useParams();

    console.log(loadedOptions);

    const showError = useException();

    const dispatch = useDispatch();

    const selectedVehicle = useSelector((state: RootState) => state.appointmentFrame.selectedVehicle);

    useEffect(() => {
        Api.call<string[]>(
            Api.endpoints.Vehicles.Models,
            {params: {serviceCenterId: decodeSCID(id)}}
        ).then(({data}) => {
            if (!data?.length) {
                setLoadedOptions(prevOptions => ({...prevOptions, model: ['Other']}));
            }
            setLoadedOptions(prevOptions => ({...prevOptions, model: data}));
        }).catch(() => {
            setLoadedOptions(prevOptions => ({...prevOptions, model: ['Other']}));
        })
        Api.call<string[]>(
            Api.endpoints.Vehicles.Makes,
            {params: {serviceCenterId: decodeSCID(id)}}
        ).then(({data}) => {
            if (!data?.length) {
                setLoadedOptions(prevOptions => ({...prevOptions, make: ['Other']}));
            }
            setLoadedOptions(prevOptions => ({...prevOptions, make: data}));
        }).catch(() => {
            setLoadedOptions(prevOptions => ({...prevOptions, make: ['Other']}));
        })
    }, [id]);

    const handleChange = (name: keyof IVehicle) =>
        (e: React.ChangeEvent<{}>, option: string|number|object|null) => {
        if (option) {
            dispatch(updateVehicle({[name]: option}));
            setErrors(e => e.filter(err => err !== name));
        }
    }
    const handleTextChange = (name: keyof IVehicle) =>
        ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateVehicle({[name]: value.trim()}));
        if (value) {
            setErrors(e => e.filter(err => err !== name));
        }
    }

    const isValid = (): boolean => {
        const errorsArray: string[] = [];
        for (let f of requiredFields) {
            if (!selectedVehicle || !selectedVehicle[f as keyof ILoadedVehicle]) {
                setErrors(e => [...e, f]);
                errorsArray.push(f);
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
                            label: select.label, placeholder: `Select ${select.label}`, error: hasError, required: requiredFields.includes(select.name)
                        })}
                        value={selectedVehicle ? selectedVehicle[select.name as keyof ILoadedVehicle] : null}
                    />
                }
                return <div key={select.name}>
                    <TextField
                        onChange={handleTextChange(select.name)}
                        label={select.label}
                        required={requiredFields.includes(select.name)}
                        name={select.name}
                        error={hasError}
                        fullWidth
                        value={selectedVehicle ? selectedVehicle[select.name as keyof ILoadedVehicle] : ""}
                        placeholder={hasError
                            ? `${select.label} required`
                            : `Type ${select.label} ${select.name === 'vin' ? '(Optional)' : ''}`}
                    />
                </div>
            })}
        </SelectWrapper>
        <Actions onBack={onBack} onNext={handleNext} />
    </StepWrapper>
};