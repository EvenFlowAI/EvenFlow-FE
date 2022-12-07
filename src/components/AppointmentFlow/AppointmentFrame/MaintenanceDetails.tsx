import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {styled, useMediaQuery, useTheme} from "@material-ui/core";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {TActionProps} from "./types";
import {useDispatch, useSelector} from "react-redux";
import {IMaintenanceDetailsShort, TMaintenanceDetails} from "../../../store/reducers/appointmentFrameReducer/types";
import {
    loadMakes, selectService,
    setMaintenanceDetails, setPackage, setVehicle,
    updateVehicle
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {RootState} from "../../../store/rootReducer";
import {useParams} from "react-router-dom";
import {EServiceCenterName, ILoadedVehicle} from "../../../api/types";
import moment from "moment";
import {TextField} from "../../UI/TextField";
import {useException} from "../../../utils/hooks";
import {decodeSCID} from "../../../utils/utils";
import {loadEngineType, loadMileage} from "../../../store/reducers/vehicleDetails/actions";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {useTranslation} from "react-i18next";
import {IEngineType} from "../../../store/reducers/vehicleDetails/types";

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

let year = moment.utc().year()
if (moment().month() > 9) year = moment.utc().add(1, 'year').year();
const YEARS = 23;
export const yearOptions: string[] = Array(YEARS).fill(0).map((_, idx) => String(year - idx));

const requiredFields: TKey[] = [
    "model", "year", "make", "mileage"
];

type TOptionsState = {[s: string]: string[]};
const blankOptions: TOptionsState = {};

type TKey = keyof TMaintenanceDetails | keyof ILoadedVehicle;

export const MaintenanceDetails: React.FC<TActionProps> = ({onNext, onBack}) => {
    const {maintenanceDetails, selectedVehicle, makes, service, valueService, serviceType}= useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const {mileage, engineTypes} = useSelector((state: RootState) => state.vehicleDetails);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const [errors, setErrors] = useState<TKey[]>([]);
    const [loadedOptions, setLoadedOptions] = useState<TOptionsState>(blankOptions);
    const [currentModels, setCurrentModels] = useState<string[] | []>([]);
    const [selectedEngine, setSelectedEngine] = useState<IEngineType|null>(null);
    const dispatch = useDispatch();
    const showError = useException();
    const theme = useTheme();
    const {id} = useParams();
    const {t} = useTranslation();

    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);

    const isNewVehicleView = useMemo(() => {
        return !Boolean(customerLoadedData?.vehicles.find(v => {
            return v.vin && selectedVehicle?.vin && v.vin === selectedVehicle?.vin
            || (v.make === selectedVehicle?.make
            && v.model === selectedVehicle?.model
            && v.year === selectedVehicle?.year)
        }));
    }, [selectedVehicle, customerLoadedData])

    const currentConfig = useMemo(() => {
        return config.find(item => item.serviceType.toString() === serviceType.toString());
    }, [config, serviceType])

    const selects: TSelect[] = [
        {label: t("VIN"), name: "vin", noVehicle: true},
        {label: t("Make"), name: "make", options: 'make'},
        {label: t("Year"), name: "year", options: yearOptions},
        {label: t("Model"), name: "model", options: "model",},
        {label: t("Estimated mileage"), name:"mileage", options: mileage.map(item => item.value.toString())},
    ];

    useEffect(() => {
        if (selectedVehicle) {
            dispatch(setMaintenanceDetails({
                make: selectedVehicle.make,
                model: selectedVehicle.model,
                year: selectedVehicle.year ? String(selectedVehicle.year) : undefined,
                mileage: selectedVehicle?.mileage?.toString() || "",
                engineTypeId: selectedVehicle.engineTypeId,
            }));
        }
    }, [dispatch, selectedVehicle]);

    useEffect(() => {
        if (selectedVehicle?.engineTypeId && engineTypes.length) {
            const option = engineTypes.find(item => item.id === Number(selectedVehicle.engineTypeId))
            option && setSelectedEngine(option);
        }
    }, [selectedVehicle, engineTypes])

    const setDataFromValueService = useCallback(() => {
        const vehicle: ILoadedVehicle = {
            vin: '',
            make: "",
            model: "",
            year: null,
            mileage: null,
            appointmentHashKeys: [],
        };
        if (valueService && isBmWService) {
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
        setDataFromValueService();
    }, [valueService, makes, isBmWService])

    useEffect(() => {
        if (currentModels.length) {
            setLoadedOptions(prevOptions => ({...prevOptions, model: currentModels}));
        }
    }, [currentModels])

    useEffect(() => {
        if (makes.length) {
            setLoadedOptions(prevOptions => ({...prevOptions, make: makes.map(item => item.name)}));
        } else {
            setLoadedOptions(prevOptions => ({...prevOptions, make: [t('Other')]}));
        }
        if (selectedVehicle?.make) {
            const currentMake = makes.find(item => item.name === selectedVehicle.make);
            if (currentMake) setLoadedOptions(prevOptions => ({...prevOptions, model: currentMake.models }));
        } else {
            setCurrentModels(() => makes.map(item => item.models).flat());
        }
    }, [makes, selectedVehicle])

    useEffect(() => {
        dispatch(loadMakes(decodeSCID(id)));
        dispatch(loadMileage(decodeSCID(id)));
        dispatch(loadEngineType(decodeSCID(id)));
    }, [id]);

    const handleChange = (name: TKey, skip?: boolean) => (e: React.ChangeEvent<{}>, option: string|null) => {
        if (isXS) e.preventDefault();
        if (option && !skip) {
            if (["year", "model", "make", "mileage"].includes(name)) {
                dispatch(updateVehicle({[name]: option}))
                dispatch(setMaintenanceDetails({[name]: option ?? null}));
            }
            setErrors(e => e.filter(err => err !== name));
            if (name === 'make') {
                if (option === t('Other')) {
                    setLoadedOptions(prevOptions => ({...prevOptions, model: [t('Other')]}));
                    if (selectedVehicle?.model) dispatch(updateVehicle({model: ''}));
                } else {
                    const currentMake = makes.find(item => item.name === option);
                    if (currentMake) setLoadedOptions(prevOptions => ({...prevOptions, model: currentMake.models }));
                    if (option !== selectedVehicle?.make) dispatch(updateVehicle({model: ''}));
                }
            }
        }
    }

    const handleEngineTypeChange =  (e: React.ChangeEvent<{}>, option: IEngineType|null) => {
        setSelectedEngine(option)
        dispatch(updateVehicle({engineTypeId: option?.id ?? null}));
        dispatch(setMaintenanceDetails({engineTypeId: option?.id ?? null}));
        setErrors(e => e.filter(err => err !== "engineTypeId"))
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
                if (f === "mileage" && !selectedVehicle?.mileage) {
                    errorsArray.push(t("Estimated Mileage"));
                } else {
                    errorsArray.push(f);
                }
            }
        }
        if (currentConfig?.engineType && !selectedEngine) {
            errorsArray.push("Engine Type")
            setErrors(e => [...e, "engineTypeId"]);
        }

        if (errorsArray.length) {
            const fields = errorsArray.map((error) => error[0].toUpperCase() + error.slice(1));
            const message = fields.join(', ').concat(fields.length < 2 ? ` ${t("is")}` : ` ${t("are")}`).concat(` ${t("required")}`);
            showError(message);
        }
        return !errorsArray.length;
    }

    const handleNext = () => {
        if (isValid()) {
            onNext();
        }
    }

    const handleBack = () => {
        if (service?.type === EServiceCategoryType.MaintenancePackage) {
            dispatch(setPackage(null))
            dispatch(selectService(null));
        }
        onBack();
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
                        disabled={select.name !== 'mileage' && !isNewVehicleView}
                        renderInput={autocompleteRender({
                            label: select.label,
                            placeholder: hasError ? `${select.label} ${t("required")}` : `${t("Select")} ${select.label}`,
                            error: hasError,
                            required: requiredFields.includes(select.name)
                        })}
                        value={!select.allOverride
                            ? maintenanceDetails[select.name as keyof IMaintenanceDetailsShort] ?? ""
                            : "All"
                        }
                    />
                }
                return isBmWService && select.name === 'vin'
                    ? null
                    : <div key={select.name}>
                    <TextField
                        onChange={handleTextChange(select.name)}
                        label={select.label}
                        name={select.name}
                        error={hasError}
                        required={requiredFields.includes(select.name)}
                        fullWidth
                        disabled={select.name !== 'mileage' && !isNewVehicleView}
                        value={selectedVehicle ? selectedVehicle[select.name as keyof ILoadedVehicle] : ""}
                        placeholder={hasError
                            ? `${select.label} ${t("required")}`
                            : `${t("Type")} ${select.label} ${select.name === 'vin' ? `(${t("Optional")})` : ''}`}
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
                // disabled={!isNewVehicleView && Boolean(selectedEngine)}
                renderInput={autocompleteRender({
                    label: "Engine Type",
                    placeholder: errors.includes("engineTypeId") ? "EngineType required" : "Select Engine Type",
                    error: errors.includes("engineTypeId"),
                    required: true,
            })}
                value={selectedEngine}
                />
            : null }
        </SelectWrapper>
        <Actions onBack={handleBack} onNext={handleNext} />
    </StepWrapper>);
};