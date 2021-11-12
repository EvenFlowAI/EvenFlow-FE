import React, {useEffect, useMemo, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {styled, useMediaQuery, useTheme} from "@material-ui/core";
import {IVehicle} from "../../../store/reducers/appointment/types";
import moment from "moment";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {loadMakes, loadModels, updateVehicle} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TextField} from "../../UI/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {ILoadedVehicle} from "../../../api/types";
import {useException} from "../../../utils/hooks";
import {decodeSCID} from "../../../utils/utils";
import {useParams} from "react-router-dom";
import {loadMileage} from "../../../store/reducers/vehicleDetails/actions";

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
    noVehicle?: boolean;
    isVin?: boolean;
};

const year = moment.utc().year();
const YEARS = 20;
const yearOptions: string[] = Array(YEARS).fill(0).map((_, idx) => String(year - idx));

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
    const [currentModels, setCurrentModels] = useState<string[] | []>([]);
    const {selectedVehicle, makes, models}= useSelector((state: RootState) => state.appointmentFrame);
    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);
    const {mileage} = useSelector((state: RootState) => state.vehicleDetails);
    const {id} = useParams();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    const showError = useException();

    const isNewVehicleView = useMemo(() => {
        return !Boolean(customerLoadedData?.vehicles.find(v => v.vin === selectedVehicle?.vin));
    }, [selectedVehicle, customerLoadedData]);

    const selects: TSelect[] = [
        {label: "VIN", name: "vin", noVehicle: true, isVin: true},
        {label: "Make", name: "make", options: 'make', noVehicle: true},
        {label: "Year", name: "year", options: yearOptions, noVehicle: true},
        {label: "Model", name: "model", options: "model", noVehicle: true},
        {label: "Estimated Mileage", name: "mileage", options: mileage.map(item => item.value.toString())},
        // {label: "Transmission", name: "transmission"},
        // {label: "Drive Type", name: "driveType"},
        // {label: "Engine Type", name: "engineType"},
    ];


    useEffect(() => {
        if (currentModels.length) {
            setLoadedOptions(prevOptions => ({...prevOptions, model: currentModels}));
        }
    }, [currentModels])

    useEffect(() => {
        dispatch(loadMakes(decodeSCID(id)));
        dispatch(loadModels(decodeSCID(id)));
        dispatch(loadMileage(decodeSCID(id)));
    }, [id]);

    useEffect(() => {
        if (currentModels.length) {
            setLoadedOptions(prevOptions => ({...prevOptions, model: currentModels}));
        }
    }, [currentModels])

    useEffect(() => {
        if (makes.length) {
            setLoadedOptions(prevOptions => ({...prevOptions, make: makes.map(item => item.name)}));
        } else {
            setLoadedOptions(prevOptions => ({...prevOptions, make: ['Other']}));
        }
        if (models.length) {
            setCurrentModels(models);
        } else {
            setCurrentModels(['Other']);
        }
    }, [makes, models])

    const handleChange = (name: keyof IVehicle) =>
        (e: React.ChangeEvent<{}>, option: string|number|object|null) => {
        if (isXS) e.preventDefault();

        if (option) setErrors(e => e.filter(err => err !== name));
        dispatch(updateVehicle({[name]: option}));

        if (name === 'make') {
            if (option === 'Other') {
                setLoadedOptions(prevOptions => ({...prevOptions, model: ['Other']}));
                if (selectedVehicle?.model) dispatch(updateVehicle({model: ''}));
            } else {
                const currentMake = makes.find(item => item.name === option);
                if (currentMake) setLoadedOptions(prevOptions => ({...prevOptions, model: currentMake.models }));
                if (option !== selectedVehicle?.make) dispatch(updateVehicle({model: ''}));
            }
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

    const getSelectValue = (select: TSelect) => {
       let value = null;
       if (selectedVehicle) value = selectedVehicle[select.name as keyof ILoadedVehicle];
       return value ? value.toString() : value;
    }

    return <StepWrapper>
        <SelectWrapper>
            {selects.map(select => {
                const hasError = errors.includes(select.name);
                if (!isNewVehicleView && select.isVin) {
                    return null;
                }
                if (select.options) {
                    return <Autocomplete
                        key={select.name}
                        options={typeof select.options === 'string'
                            ? loadedOptions[select.options] ?? []
                            : select.options ?? []}
                        onChange={handleChange(select.name)}
                        fullWidth
                        disabled={select.noVehicle && !isNewVehicleView}
                        autoComplete={true}
                        renderInput={autocompleteRender({
                            label: select.label, placeholder: `Select ${select.label}`, error: hasError, required: requiredFields.includes(select.name)
                        })}
                        value={getSelectValue(select)}
                    />
                }
                return <div key={select.name}>
                    <TextField
                        onChange={handleTextChange(select.name)}
                        label={select.label}
                        required={requiredFields.includes(select.name)}
                        name={select.name}
                        error={hasError}
                        disabled={select.noVehicle && !isNewVehicleView}
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