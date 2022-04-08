import React, {useEffect, useMemo, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {styled, useMediaQuery, useTheme} from "@material-ui/core";
import {IVehicle} from "../../../store/reducers/appointment/types";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {loadMakes, updateVehicle} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TextField} from "../../UI/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EServiceCenterName, ILoadedVehicle} from "../../../api/types";
import {useException} from "../../../utils/hooks";
import {decodeSCID} from "../../../utils/utils";
import {useParams} from "react-router-dom";
import {loadMileage} from "../../../store/reducers/vehicleDetails/actions";
import {yearOptions} from "./MaintenanceDetails";

export const SelectWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    width: "100%",
    "& .label": {
        fontWeight: 700,
        margin: '0 0 4px 0',
        textTransform: 'uppercase',
        fontSize: 12,
    },
    '& > div > div > div': {
        borderRadius: 0,
        backgroundColor: '#F7F8FB',
        padding: 2,
        border: "1px solid #DADADA",
        '& > div > div': {
            fontSize: '1rem',
        }
    },
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
    const {selectedVehicle, makes}= useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData, scProfile}= useSelector((state: RootState) => state.appointment);
    const {mileage} = useSelector((state: RootState) => state.vehicleDetails);
    const {id} = useParams();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    const showError = useException();
    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);

    const isNewVehicleView = useMemo(() => {
        return !Boolean(customerLoadedData?.vehicles.find(v => v.vin && selectedVehicle?.vin && v.vin === selectedVehicle?.vin));
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
        if (selectedVehicle?.make) {
            const currentMake = makes.find(item => item.name === selectedVehicle.make);
            if (currentMake) setLoadedOptions(prevOptions => ({...prevOptions, model: currentMake.models }));
        } else {
            setCurrentModels(() => makes.map(item => item.models).flat());
        }
    }, [makes, selectedVehicle])

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
                return isBmWService && select.name === 'vin'
                    ? null
                    : <div key={select.name}>
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