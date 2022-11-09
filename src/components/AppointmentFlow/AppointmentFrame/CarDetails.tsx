import React, {useEffect, useMemo, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {styled, useMediaQuery, useTheme} from "@material-ui/core";
import {IVehicle} from "../../../store/reducers/appointment/types";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {
    loadMakes,
    setMaintenanceDetails,
    setVehicle,
    updateVehicle
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TextField} from "../../UI/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EServiceCenterName, ILoadedVehicle} from "../../../api/types";
import {useException} from "../../../utils/hooks";
import {decodeSCID} from "../../../utils/utils";
import {useParams} from "react-router-dom";
import {loadEngineType, loadMileage} from "../../../store/reducers/vehicleDetails/actions";
import {yearOptions} from "./MaintenanceDetails";
import {useTranslation} from "react-i18next";
import {IEngineType} from "../../../store/reducers/vehicleDetails/types";

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
    // '& > div > div > div': {
    //     borderRadius: 0,
    //     backgroundColor: '#F7F8FB',
    //     padding: 2,
    //     border: "1px solid #DADADA",
    //     '& > div > div': {
    //         fontSize: '1rem',
    //     }
    // },
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
    const {selectedVehicle, makes, valueService, serviceType}= useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData, scProfile}= useSelector((state: RootState) => state.appointment);
    const {mileage, engineTypes} = useSelector((state: RootState) => state.vehicleDetails);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);

    const [loadedOptions, setLoadedOptions] = useState<TOptionsState>(blankOptions);
    const [errors, setErrors] = useState<TVehicleKey[]>([]);
    const [currentModels, setCurrentModels] = useState<string[] | []>([]);
    const [selectedEngine, setSelectedEngine] = useState<IEngineType|null>(null);
    const {id} = useParams();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    const showError = useException();
    const {t} = useTranslation();

    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);

    const isNewVehicleView = useMemo(() => {
        return !Boolean(customerLoadedData?.vehicles.find(v => v.vin && selectedVehicle?.vin && v.vin === selectedVehicle?.vin));
    }, [selectedVehicle, customerLoadedData]);

    const currentConfig = useMemo(() => {
        return config.find(item => item.serviceType.toString() === serviceType.toString());
    }, [config, serviceType])

    const selects: TSelect[] = [
        {label: t("VIN"), name: "vin", noVehicle: true, isVin: true},
        {label: t("Make"), name: "make", options: 'make', noVehicle: true},
        {label: t("Year"), name: "year", options: yearOptions, noVehicle: true},
        {label: t("Model"), name: "model", options: "model", noVehicle: true},
        {label: t("Estimated Mileage"), name: "mileage", options: mileage.map(item => item.value.toString())},
    ];

    useEffect(() => {
        if (selectedVehicle) {
            dispatch(setMaintenanceDetails({
                make: selectedVehicle.make,
                model: selectedVehicle.model,
                year: selectedVehicle.year ? String(selectedVehicle.year) : undefined,
                mileage: selectedVehicle?.mileage?.toString() || "",
            }));
        }
    }, [dispatch, selectedVehicle]);

    useEffect(() => {
        if (valueService && isBmWService) {
            const vehicle: ILoadedVehicle = {
                vin: '',
                make: "",
                model: "",
                year: null,
                mileage: null,
                appointmentHashKeys: [],
            };
            const bmwMake = makes.find(item => item.name === "BMW");
            if (bmwMake) {
                dispatch(setMaintenanceDetails({make: bmwMake.name}));
                vehicle.make = bmwMake.name;

                if (valueService?.year?.year && yearOptions.find(option => Number(option) === valueService?.year?.year)) {
                    dispatch(setMaintenanceDetails({year: valueService.year.year.toString()}));
                    vehicle.year = Number(valueService.year.year)
                }

                const model = bmwMake.models.find(model => model === valueService.series?.name);
                if (model) {
                    dispatch(setMaintenanceDetails({model}));
                    vehicle.model = model;
                }
                dispatch(setVehicle(vehicle));
            }
        }
    }, [valueService, makes, isBmWService])


    useEffect(() => {
        if (currentModels.length) {
            setLoadedOptions(prevOptions => ({...prevOptions, model: currentModels}));
        }
    }, [currentModels])

    useEffect(() => {
        dispatch(loadMakes(decodeSCID(id)));
        dispatch(loadMileage(decodeSCID(id)));
        dispatch(loadEngineType(decodeSCID(id)));
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
            setLoadedOptions(prevOptions => ({...prevOptions, make: [t("Other")]}));
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
            if (option === t("Other")) {
                setLoadedOptions(prevOptions => ({...prevOptions, model: [t("Other")]}));
                if (selectedVehicle?.model) dispatch(updateVehicle({model: ''}));
            } else {
                const currentMake = makes.find(item => item.name === option);
                if (currentMake) setLoadedOptions(prevOptions => ({...prevOptions, model: currentMake.models }));
                if (option !== selectedVehicle?.make) dispatch(updateVehicle({model: ''}));
            }
        }
    }

    const handleEngineTypeChange =  (e: React.ChangeEvent<{}>, option: IEngineType|null) => {
        setSelectedEngine(option)
        setErrors(e => e.filter(err => err !== "engineType"))
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

        if (currentConfig?.engineType && !selectedEngine) {
            errorsArray.push("Engine Type")
            setErrors(e => [...e, "engineType"]);
        }

        if (errorsArray.length) {
            const fields = errorsArray.map((error) => error[0].toUpperCase() + error.slice(1));
            const message = fields.join(', ').concat(fields.length < 2 ? ` ${t("is")}` : ` ${t("are")}`).concat( ` ${t("required")}`);
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
                            label: select.label, placeholder: `${t("Select")} ${select.label}`, error: hasError, required: requiredFields.includes(select.name)
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
                            ? `${select.label} ${t("required")}`
                            : `${t("Type (enter)")} ${select.label} ${select.name === 'vin' ? `(${t("Optional")})` : ''}`}
                    />
                </div>
            })}
            {currentConfig?.engineType
                ? <Autocomplete
                    key="Engine Type"
                    options={engineTypes}
                    onChange={handleEngineTypeChange}
                    fullWidth
                    getOptionLabel={o => o.name}
                    getOptionSelected={o => o.id === selectedEngine?.id}
                    disableClearable
                    autoComplete={true}
                    disabled={!isNewVehicleView}
                    renderInput={autocompleteRender({
                        label: "Engine Type",
                        placeholder: errors.includes("engineType") ? "EngineType required" : "Select Engine Type",
                        error: errors.includes("engineType"),
                        required: true,
                    })}
                    value={selectedEngine ?? undefined}
                />
                : null }
        </SelectWrapper>
        <Actions onBack={onBack} onNext={handleNext} />
    </StepWrapper>
};