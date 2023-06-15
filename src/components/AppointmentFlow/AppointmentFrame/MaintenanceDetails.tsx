import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {styled, useMediaQuery, useTheme} from "@material-ui/core";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {useDispatch, useSelector} from "react-redux";
import {EUserType, TMaintenanceDetails} from "../../../store/reducers/appointmentFrameReducer/types";
import {
    selectService,
    setMaintenanceDetails,
    setPackage,
    setRecallsAreShown,
    setVehicle,
    updateVehicle
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {RootState} from "../../../store/rootReducer";
import {useParams} from "react-router-dom";
import {EServiceCategoryPage, EServiceCenterName, ILoadedVehicle} from "../../../api/types";
import moment from "moment";
import {TextField} from "../../UI/TextField";
import {useException, useModal} from "../../../utils/hooks";
import {decodeSCID} from "../../../utils/utils";
import {loadEngineType, loadMileage} from "../../../store/reducers/vehicleDetails/actions";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {useTranslation} from "react-i18next";
import {IEngineType} from "../../../store/reducers/vehicleDetails/types";
import {TArgCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {TServiceTypeSettings} from "../../../store/reducers/bookingFlowConfig/types";
import RecallsByVin from "../../Modals/RecallsByVin/RecallsByVin";
import {Api} from "../../../config/requests";
import {Loading} from "../../UI/Loading";
import {makeStyles} from "@material-ui/core/styles";
import NoRecalls from "../../Modals/RecallsByVin/NoRecalls";

const SelectWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr"
    }
}));

const useStyles = makeStyles(() => ({
    vinWrapper: {
        '& > label': {
            textTransform: 'none',
            fontSize: 14,
            color: "#142EA1",
            fontWeight: "normal",
        }
    }
}))

let year = moment.utc().year()
if (moment().month() > 9) year = moment.utc().add(1, 'year').year();
const YEARS = 23;
export const yearOptions: string[] = Array(YEARS).fill(0).map((_, idx) => String(year - idx));

type TOptionsState = {[s: string]: string[]};
const blankOptions: TOptionsState = {};

type TKey = keyof TMaintenanceDetails | keyof ILoadedVehicle;

type TMaintenanceDetailsProps = {
    onBack: TArgCallback<TScreen>;
    onNext: TArgCallback<TScreen>;
    currentConfig: TServiceTypeSettings|undefined;
}
const requiredFields: TKey[] = ["model", "year", "make", "mileage"];

export const MaintenanceDetails: React.FC<TMaintenanceDetailsProps> = ({onNext, onBack, currentConfig}) => {
    const {
        maintenanceDetails,
        selectedVehicle,
        makes,
        service,
        valueService,
        subService,
        userType,
        recallsAreShown,
        categoriesIds
    }= useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const {mileage, engineTypes} = useSelector((state: RootState) => state.vehicleDetails);
    const [errors, setErrors] = useState<TKey[]>([]);
    const [loadedOptions, setLoadedOptions] = useState<TOptionsState>(blankOptions);
    const [currentModels, setCurrentModels] = useState<string[] | []>([]);
    const [selectedEngine, setSelectedEngine] = useState<IEngineType|null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);

    const dispatch = useDispatch();
    const showError = useException();
    const theme = useTheme();
    const {id} = useParams();
    const {t} = useTranslation();
    const {isOpen, onOpen, onClose} = useModal();
    const {isOpen: isNoRecallsOpen, onOpen: onNoRecallsOpen, onClose: onNoRecallsClose} = useModal();
    const classes = useStyles();

    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    const isSM = useMediaQuery(theme.breakpoints.down("sm"));

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

    const recallsToggledOn = useMemo(() => (currentConfig?.checkRecallsNew && userType === EUserType.New)
        || (currentConfig?.checkRecallsExisting && userType === EUserType.Existing), [currentConfig, userType])

    const isRecallsCategorySelected = useMemo(() => {
        const isServiceRecall = service?.type == EServiceCategoryType.OpenRecalls && service.page === EServiceCategoryPage.Page1;
        const isSubServiceRecall = subService?.type == EServiceCategoryType.OpenRecalls && subService.page === EServiceCategoryPage.Page2;
        return isServiceRecall || isSubServiceRecall;
    }, [service, subService])

    const isNextDisabled = useMemo(() => {
        return !Boolean(maintenanceDetails.make
            && maintenanceDetails.model
            && maintenanceDetails.year
            && maintenanceDetails.mileage
            && (currentConfig?.engineType ? maintenanceDetails.engineTypeId : true)
            && (isRecallsCategorySelected ? maintenanceDetails.vin : true))
    }, [maintenanceDetails, currentConfig, isRecallsCategorySelected])

    useEffect(() => {
        if (selectedVehicle) {
            const selectedMileage = mileage.find(item => item.value.toString() === selectedVehicle?.mileage?.toString());
            dispatch(setMaintenanceDetails({
                make: selectedVehicle.make,
                model: selectedVehicle.model,
                year: selectedVehicle.year ? String(selectedVehicle.year) : undefined,
                mileage: selectedMileage?.value?.toString() ?? "",
                engineTypeId: selectedVehicle.engineTypeId,
            }));
        }
    }, [dispatch, selectedVehicle, mileage]);

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
        if (!selectedVehicle?.make) {
            const defaultMake = makes.find(item => item.id === scProfile?.defaultVehicleMakeId)
            if (defaultMake) {
                dispatch(setMaintenanceDetails({make: defaultMake.name}));
                selectedVehicle && dispatch(setVehicle({...selectedVehicle, make: defaultMake.name}))
                setCurrentModels(defaultMake.models);
            }
        }
    }, [makes, selectedVehicle])

    useEffect(() => {
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
        dispatch(setRecallsAreShown(false));
        dispatch(updateVehicle({[name]: value.trim()}));
        dispatch(setMaintenanceDetails({[name]: value.trim()}));
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
            errorsArray.push(scProfile?.engineTypeFieldName ?? "Engine Type");
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
            onNext(service?.type === EServiceCategoryType.MaintenancePackage
                ? 'packageSelection'
                : currentConfig?.advisorSelection
                    ? 'consultantSelection'
                    : currentConfig?.appointmentSelection
                        ? 'appointmentTiming'
                        : "appointmentSelection");
        }
    }

    const handleBack = () => {
        if (service?.type === EServiceCategoryType.MaintenancePackage) {
            dispatch(setPackage(null))
            dispatch(selectService(null));
        }
        onBack(service?.type === EServiceCategoryType.Diagnose || subService?.type === EServiceCategoryType.IndividualServices
            ? 'opsCode' : 'serviceNeeds');
    }

    const handleDeclineRecalls = () => {
        if (isRecallsCategorySelected && categoriesIds.length < 2) {
            onBack('serviceNeeds');
        } else {
            handleNext()
        }
    }

    const handleSubmit = async () => {
        if (selectedVehicle?.vin?.length === 17 && recallsToggledOn && (!recallsAreShown|| isRecallsCategorySelected)) {
            setLoading(true);
            const make = makes.find(item => item.name.toLowerCase() === selectedVehicle.make.toLowerCase());
            if (selectedVehicle?.make && make?.id) {
                const {data} = await Api.call(Api.endpoints.Recalls.GetByVin, {data: {serviceCenterId: decodeSCID(id), vin: selectedVehicle.vin, vehicleMakeId: make?.id}})
                dispatch(setRecallsAreShown(true));
                if (data.length) {
                    await onOpen()
                } else {
                    if (userType === EUserType.New || isRecallsCategorySelected) {
                        onNoRecallsOpen()
                    } else {
                        handleNext();
                    }
                }
            } else handleNext();
        } else {
            if (categoriesIds.length < 2 && isRecallsCategorySelected) {
                handleBack()
            } else {
                handleNext()
            }
        }
        setLoading(false);
    }

    const orderMapStyles = {
        year: {order: isSM ? 2 : !currentConfig?.engineType && !recallsToggledOn ? 1 : 4},
        mileage: {order: (currentConfig?.engineType || recallsToggledOn) && !isSM ? 1 : 3},
        make: {order: 0},
        model: {order: isSM ? 1 : 2},
        vin: {order: isSM ? 5 : currentConfig?.engineType ? 5 : 3},
        engineType: {order: isSM ? 4 : 3}
    }

    return (<StepWrapper>
        {isLoading
            ? <Loading/>
            : <SelectWrapper>
                <Autocomplete
                    key="year"
                    style={orderMapStyles.year}
                    options={yearOptions}
                    onChange={handleChange('year', false)}
                    fullWidth
                    disableClearable
                    autoComplete={true}
                    disabled={!isNewVehicleView}
                    renderInput={autocompleteRender({
                        label: t("Year"),
                        placeholder: errors.includes("year") ? `${t("Year")} ${t("required")}` : `${t("Select")} ${t("Year")}`,
                        error: errors.includes("year"),
                        required: requiredFields.includes('year')
                    })}
                    value={maintenanceDetails.year ?? ''}
                />
                <Autocomplete
                    key="mileage"
                    style={orderMapStyles.mileage}
                    options={mileage.map(item => item.value.toString())}
                    onChange={handleChange('mileage', false)}
                    fullWidth
                    disableClearable
                    autoComplete={true}
                    renderInput={autocompleteRender({
                        label: t("Estimated mileage"),
                        placeholder: errors.includes("mileage") ? `${t("Estimated mileage")} ${t("required")}` : `${t("Select")} ${t("Estimated mileage")}`,
                        error: errors.includes("mileage"),
                        required: requiredFields.includes('mileage')
                    })}
                    value={maintenanceDetails.mileage ?? ''}
                />
                <Autocomplete
                    key="make"
                    style={orderMapStyles.make}
                    options={loadedOptions.make ?? []}
                    onChange={handleChange('make', false)}
                    fullWidth
                    disableClearable
                    autoComplete={true}
                    disabled={!isNewVehicleView}
                    renderInput={autocompleteRender({
                        label: t("Make"),
                        placeholder: errors.includes("make") ? `${t("Make")} ${t("required")}` : `${t("Select")} ${t("Make")}`,
                        error: errors.includes("make"),
                        required: requiredFields.includes('make')
                    })}
                    value={maintenanceDetails.make ?? ''}
                />
                {currentConfig?.engineType
                    ? <Autocomplete
                        key="Engine Type"
                        style={orderMapStyles.engineType}
                        options={engineTypes}
                        onChange={handleEngineTypeChange}
                        fullWidth
                        getOptionLabel={o => o.name}
                        getOptionSelected={o => o.id === selectedEngine?.id}
                        // disabled={!isNewVehicleView && Boolean(selectedEngine)}
                        renderInput={autocompleteRender({
                            label: scProfile?.engineTypeFieldName ?? t("Engine Type"),
                            placeholder: errors.includes("engineTypeId")
                                ? `${scProfile?.engineTypeFieldName ?? t("Engine Type")} ${t("required")}`
                                : `${t("Select")} ${scProfile?.engineTypeFieldName ?? t("Engine Type")}`,
                            error: errors.includes("engineTypeId"),
                            required: true,
                        })}
                        value={selectedEngine}
                    />
                    : null}
                <Autocomplete
                    key="model"
                    options={loadedOptions.model ?? []}
                    onChange={handleChange('model', false)}
                    style={orderMapStyles.model}
                    fullWidth
                    disableClearable
                    autoComplete={true}
                    disabled={!isNewVehicleView}
                    renderInput={autocompleteRender({
                        label: t("Model"),
                        placeholder: errors.includes("model") ? `${t("Model")} ${t("required")}` : `${t("Select")} ${t("Model")}`,
                        error: errors.includes("model"),
                        required: requiredFields.includes('model')
                    })}
                    value={maintenanceDetails.model ?? ''}
                />
                {(userType === EUserType.New || isNewVehicleView) && recallsToggledOn
                    ? <div key="vin" className={recallsToggledOn ? classes.vinWrapper : ""} style={orderMapStyles.vin}>
                        <TextField
                            onChange={handleTextChange("vin")}
                            label={recallsToggledOn
                                ? t("OPTIONAL: Please enter your VIN to check for open Safety Recalls")
                                : `${t("VIN")} (${t("Optional")})`
                            }
                            name={"vin"}
                            error={errors.includes("vin")}
                            required={requiredFields.includes("vin") || isRecallsCategorySelected}
                            fullWidth
                            disabled={!isNewVehicleView || (recallsAreShown && !isRecallsCategorySelected)}
                            value={selectedVehicle ? selectedVehicle.vin : ""}
                            placeholder={errors.includes("vin")
                                ? `${t("VIN")} ${t("required")}`
                                : `${t("Type")} ${t("VIN")} (${t("Optional")})`}
                        />
                    </div> : null}
            </SelectWrapper>
        }
        <Actions
            onBack={handleBack}
            onNext={handleSubmit}
            prevDisabled={isLoading}
            nextDisabled={isNextDisabled || isLoading}
            nextLabel={isRecallsCategorySelected ? t("Check for Recalls") : t("Next")}
        />
        <RecallsByVin open={isOpen} onClose={onClose} handleNext={handleNext} onDeclineRecalls={handleDeclineRecalls}/>
        <NoRecalls open={isNoRecallsOpen} onClose={onNoRecallsClose} handleNext={handleDeclineRecalls}/>
    </StepWrapper>);
};