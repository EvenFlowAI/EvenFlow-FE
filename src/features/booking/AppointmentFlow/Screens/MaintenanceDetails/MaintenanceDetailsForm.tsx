import React, {useEffect, useMemo, useState} from 'react';
import {autocompleteRender} from "../../../../../utils/autocompleteRenders";
import {Autocomplete, useMediaQuery, useTheme} from '@mui/material';
import {StepWrapper} from "../../../../../components/styled/StepWrapper";
import {ActionButtons} from "../../../ActionButtons/ActionButtons";
import {useDispatch, useSelector} from "react-redux";
import {EUserType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {
    clearAppointmentSteps,
    selectCategoriesIds,
    selectService,
    selectSubService,
    setRecallsAreShown,
    setSelectedRecalls,
    setVehicle,
    setVehicleDataFromValueService,
    updateVehicle
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {RootState} from "../../../../../store/rootReducer";
import {useParams} from "react-router-dom";
import {EServiceCategoryPage, EServiceCenterName, ILoadedVehicle} from "../../../../../api/types";
import {TextField} from "../../../../../components/formControls/TextFieldStyled/TextField";
import {decodeSCID, getYearOptions} from "../../../../../utils/utils";
import {EServiceCategoryType} from "../../../../../store/reducers/categories/types";
import {useTranslation} from "react-i18next";
import {IEngineType} from "../../../../../store/reducers/vehicleDetails/types";
import {TArgCallback, TCallback, TScreen} from "../../../../../types/types";
import RecallsByVinModal from "../../../RecallsByVinModal/RecallsByVinModal";
import {Loading} from "../../../../../components/wrappers/Loading/Loading";
import NoRecallsModal from "../../../NoRecallsModal/NoRecallsModal";
import {SelectWrapper, useStyles} from "./styles";
import {TKey, TOptionsState} from "./types";
import {useModal} from "../../../../../hooks/useModal/useModal";
import {useException} from "../../../../../hooks/useException/useException";
import {Api} from "../../../../../api/ApiEndpoints/ApiEndpoints";

type TMaintenanceDetailsProps = {
    onBack: TArgCallback<TScreen>;
    serviceCategoryPage: EServiceCategoryPage;
    handleNext: TCallback;
}

const blankOptions: TOptionsState = {};

const checkVin = (vin: string) => {
    return vin && vin.length === 17 && (vin.includes('~') || vin.match(/[(A-H|J-N|P|R-Z|0-9)]{17}/gm))
}

export const MaintenanceDetailsForm: React.FC<React.PropsWithChildren<React.PropsWithChildren<TMaintenanceDetailsProps>>> =
    ({onBack, serviceCategoryPage, handleNext}) => {
        const {
            selectedVehicle,
            makes,
            service,
            valueService,
            subService,
            userType,
            recallsAreShown,
            categoriesIds,
            selectedPackage,
            appointmentByKey,
            selectedRecalls
        }= useSelector((state: RootState) => state.appointmentFrame);
        const {allCategories} = useSelector(({categories}: RootState) => categories)
        const {customerLoadedData, scProfile, selectedSR} = useSelector((state: RootState) => state.appointment);
        const {mileage, engineTypes} = useSelector((state: RootState) => state.vehicleDetails);
        const {currentConfig} = useSelector((state: RootState) => state.bookingFlowConfig);
        const [errors, setErrors] = useState<TKey[]>([]);
        const [loadedOptions, setLoadedOptions] = useState<TOptionsState>(blankOptions);
        const [currentModels, setCurrentModels] = useState<string[] | []>([]);
        const [selectedEngine, setSelectedEngine] = useState<IEngineType|null>(null);
        const [isLoading, setLoading] = useState<boolean>(false);

        const dispatch = useDispatch();
        const showError = useException();
        const theme = useTheme();
        const {id} = useParams<{id: string}>();
        const {t} = useTranslation();
        const {isOpen, onOpen, onClose} = useModal();
        const {isOpen: isNoRecallsOpen, onOpen: onNoRecallsOpen, onClose: onNoRecallsClose} = useModal();
        const { classes  } = useStyles();

        const isXS = useMediaQuery(theme.breakpoints.down('sm'));
        const isSM = useMediaQuery(theme.breakpoints.down('md'));
        const requiredFields: TKey[] = ["model", "year", "make", "mileage"];

        const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
            || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);

        const isExistingVin = useMemo(() => {
            return Boolean(customerLoadedData?.vehicles.find(v => {
                return (v.vin && selectedVehicle?.vin && v.vin.toUpperCase() === selectedVehicle?.vin.toUpperCase())}));
        }, [selectedVehicle, customerLoadedData])

        const isExistingVehicle = useMemo(() => {
            return Boolean(customerLoadedData?.vehicles.find(v => {
                return (v.vin && selectedVehicle?.vin && v.vin === selectedVehicle?.vin)
                    || (v.make === selectedVehicle?.make
                        && v.model === selectedVehicle?.model
                        && v.year
                        && v.year?.toString() === selectedVehicle?.year?.toString())
            }));
        }, [selectedVehicle, customerLoadedData])

        const recallsToggledOn = useMemo(() => (currentConfig?.checkRecallsNew && userType === EUserType.New)
            || (currentConfig?.checkRecallsExisting && userType === EUserType.Existing), [currentConfig, userType])

        const isRecallsCategorySelected = useMemo(() => {
            const isServiceRecall = service?.type == EServiceCategoryType.OpenRecalls && service.page === EServiceCategoryPage.Page1;
            const isSubServiceRecall = subService?.type == EServiceCategoryType.OpenRecalls && subService.page === EServiceCategoryPage.Page2;
            return isServiceRecall || isSubServiceRecall;
        }, [service, subService])

        const onlyRecallsSelected = useMemo(() => {
            const selectedCategories = allCategories.filter(el => categoriesIds.includes(el.id));
            const isGeneralCategorySelected = selectedCategories.find(el => el.type === EServiceCategoryType.GeneralCategory);
            return !selectedSR.length && !selectedPackage && !isGeneralCategorySelected && isRecallsCategorySelected
        }, [selectedSR, selectedPackage, isRecallsCategorySelected, categoriesIds, allCategories])

        const isNextDisabled = useMemo(() => {
            return !Boolean(selectedVehicle?.make
                && selectedVehicle?.model
                && selectedVehicle?.year
                && selectedVehicle?.mileage
                && (currentConfig?.engineType ? selectedVehicle?.engineTypeId : true)
                && (isRecallsCategorySelected ? selectedVehicle?.vin : true))
        }, [selectedVehicle, currentConfig, isRecallsCategorySelected])

        useEffect(() => {
            const selectedMileage = mileage.find(item => item.value.toString() === selectedVehicle?.mileage?.toString());
            const mileageIsValid = selectedMileage && selectedMileage?.value.toString() === selectedVehicle?.mileage?.toString();
            if (selectedVehicle) {
                if (selectedVehicle.vin && !checkVin(selectedVehicle.vin)) {
                    const vin = selectedVehicle.vin.toUpperCase()
                    if (checkVin(vin)) dispatch(updateVehicle({vin}))
                }
                if (selectedMileage?.value) {
                    const theSameMileageSelected = selectedVehicle?.mileage === selectedMileage?.value
                    if (mileageIsValid && !theSameMileageSelected) {
                        dispatch(updateVehicle({mileage: selectedMileage.value}))
                    }
                } else if (selectedVehicle.mileage) {
                    dispatch(updateVehicle({mileage: null}))
                }
            }
        }, [dispatch, mileage, selectedVehicle]);

        useEffect(() => {
            if (isRecallsCategorySelected) requiredFields.push('vin')
        }, [isRecallsCategorySelected])

        useEffect(() => {
            if (selectedVehicle?.engineTypeId && engineTypes.length) {
                const option = engineTypes.find(item => item.id === Number(selectedVehicle.engineTypeId))
                option && setSelectedEngine(option);
            }
        }, [selectedVehicle, engineTypes])

        useEffect(() => {
            dispatch(setVehicleDataFromValueService())
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
                    selectedVehicle && dispatch(setVehicle({...selectedVehicle, make: defaultMake.name}))
                    setCurrentModels(defaultMake.models);
                }
            }
        }, [makes, selectedVehicle])

        const handleChange = (name: TKey, skip?: boolean) => (e: React.ChangeEvent<{}>, option: string|null) => {
            // if (isXS) e.preventDefault();
            if (option && !skip) {
                if (["year", "model", "make", "mileage"].includes(name)) {
                    dispatch(updateVehicle({[name]: option}))
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
            setErrors(e => e.filter(err => err !== "engineTypeId"))
        }

        const handleVINChange = (name: TKey) => ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(setRecallsAreShown(false));
            dispatch(updateVehicle({[name]: value.trim().toUpperCase()}));
            setErrors(e => e.filter(err => err !== name));
        }

        const removeRecallCategory = () => {
            if (service?.type === EServiceCategoryType.OpenRecalls && serviceCategoryPage === EServiceCategoryPage.Page1) {
                dispatch(selectService(null));
                dispatch(selectCategoriesIds(categoriesIds.filter(el => el !== service.id)))
            }
            if (subService?.type === EServiceCategoryType.OpenRecalls && serviceCategoryPage === EServiceCategoryPage.Page2) {
                dispatch(selectSubService(null));
                dispatch(selectCategoriesIds(categoriesIds.filter(el => el !== subService.id)))
            }
        }

        const handleBack = () => {
            if (isRecallsCategorySelected && !selectedRecalls.length) removeRecallCategory()
            onBack(service?.type === EServiceCategoryType.Diagnose || subService?.type === EServiceCategoryType.IndividualServices
                ? 'opsCode' : 'serviceNeeds');
        }

        const onNext = () => {
            if (isValid()) handleNext()
        }

        const handleDeclineRecalls = () => {
            dispatch(setSelectedRecalls([]));
            if (isRecallsCategorySelected) {
                if (onlyRecallsSelected) {
                    dispatch(clearAppointmentSteps("serviceNeeds"))
                    onBack('serviceNeeds');
                } else {
                    onNext()
                }
            } else {
                onNext()
            }
        }

        const handleAddServices = () => {
            onBack('serviceNeeds');
        }

        const onEmptyRecalls = () => {
            if (userType === EUserType.New || isRecallsCategorySelected) {
                onNoRecallsOpen()
            } else {
                onNext();
            }
        }

        const checkVINforRecallCategory = () => {
            if (!selectedVehicle?.vin || !checkVin(selectedVehicle?.vin)) {
                setErrors(prev => ([...prev, 'vin']))
                showError("VIN is not correct")
            } else {
                onNoRecallsOpen()
            }
        }

        const handleNoRecalls = () => {
            if (categoriesIds.length < 2 && isRecallsCategorySelected) {
                checkVINforRecallCategory()
            } else {
                onNext()
            }
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
            if (selectedVehicle?.vin && !checkVin(selectedVehicle.vin)) {
                setErrors(prev => ([...prev, 'vin']))
                showError("VIN is not correct")
                return false
            }

            return !errorsArray.length;
        }

        const handleSubmit = async () => {
            const recallsFromTheAdmin = !recallsAreShown && recallsToggledOn;
            const makeInTheList = makes.find(item => item.name.toLowerCase() === selectedVehicle?.make.toLowerCase());
            if (selectedVehicle && makeInTheList && (!customerLoadedData?.isUpdating || isRecallsCategorySelected)) {
                const {vin, make, model, year} = selectedVehicle;
                if (checkVin(vin)) {
                    if (vin && make && (recallsFromTheAdmin || isRecallsCategorySelected) && year) {
                        setLoading(true);
                        try {
                            const {data} = await Api.call(Api.endpoints.Recalls.GetByVin,
                                {data: {serviceCenterId: decodeSCID(id), vin: vin.toUpperCase(), make, year: +year, model}})
                            dispatch(setRecallsAreShown(true));
                            if (data.length) {
                                await onOpen()
                            } else {
                                onEmptyRecalls()
                            }
                        } catch (err) {
                            console.log(err)
                            onEmptyRecalls()
                        }
                    } else {
                        handleNoRecalls()
                    }
                } else {
                    if (!vin?.length && !isRecallsCategorySelected && !requiredFields.includes("vin")) {
                        handleNoRecalls()
                    } else {
                        setErrors(prev => ([...prev, 'vin']))
                        showError("VIN is not correct")
                    }
                }
            } else {
                handleNoRecalls()
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

        const onNextForRecalls = () => {
            if (onlyRecallsSelected && !selectedRecalls.length) {
                dispatch(clearAppointmentSteps("serviceNeeds"))
                onBack('serviceNeeds');
            } else {
                onNext()
            }
        }

        return (
            <StepWrapper>
                {isLoading
                    ? <Loading/>
                    : <SelectWrapper>
                        <Autocomplete
                            key="year"
                            style={{...orderMapStyles.year}}
                            options={getYearOptions()}
                            onChange={handleChange('year', false)}
                            fullWidth
                            disableClearable
                            getOptionLabel={o => o}
                            getOptionKey={o => o}
                            isOptionEqualToValue={(o, v) => o === v}
                            disabled={isExistingVehicle}
                            renderInput={autocompleteRender({
                                label: t("Year"),
                                placeholder: errors.includes("year") ? `${t("Year")} ${t("required")}` : `${t("Select")} ${t("Year")}`,
                                error: errors.includes("year"),
                                required: requiredFields.includes('year')
                            })}
                            value={selectedVehicle?.year ? selectedVehicle.year.toString() : ''}
                        />
                        <Autocomplete
                            key="mileage"
                            style={orderMapStyles.mileage}
                            isOptionEqualToValue={(o, v) => o === v}
                            getOptionLabel={o => o}
                            getOptionKey={o => o}
                            options={mileage.map(item => item.value.toString())}
                            onChange={handleChange('mileage', false)}
                            fullWidth
                            disableClearable
                            renderInput={autocompleteRender({
                                label: t("Estimated mileage"),
                                placeholder: errors.includes("mileage") ? `${t("Estimated mileage")} ${t("required")}` : `${t("Select")} ${t("Estimated mileage")}`,
                                error: errors.includes("mileage"),
                                required: requiredFields.includes('mileage')
                            })}
                            value={selectedVehicle?.mileage ? selectedVehicle.mileage.toString() : ''}
                        />
                        <Autocomplete
                            key="make"
                            style={orderMapStyles.make}
                            options={loadedOptions.make ?? []}
                            onChange={handleChange('make', false)}
                            fullWidth
                            getOptionLabel={o => o}
                            getOptionKey={o => o}
                            isOptionEqualToValue={(o, v) => o === v}
                            disableClearable
                            disabled={isExistingVehicle}
                            renderInput={autocompleteRender({
                                label: t("Make"),
                                placeholder: errors.includes("make") ? `${t("Make")} ${t("required")}` : `${t("Select")} ${t("Make")}`,
                                error: errors.includes("make"),
                                required: requiredFields.includes('make')
                            })}
                            value={selectedVehicle?.make ? selectedVehicle.make?.toString() : ''}
                        />
                        {currentConfig?.engineType
                            ? <Autocomplete
                                key="Engine Type"
                                style={orderMapStyles.engineType}
                                options={engineTypes}
                                onChange={handleEngineTypeChange}
                                fullWidth
                                getOptionLabel={o => o.name}
                                getOptionKey={o => o.id}
                                isOptionEqualToValue={o => o.id === selectedEngine?.id}
                                disabled={Boolean(selectedEngine) && Boolean(appointmentByKey?.vehicle?.engineTypeId)}
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
                            autoComplete={false}
                            getOptionLabel={o => o}
                            getOptionKey={o => o}
                            isOptionEqualToValue={(o, v) => o === v}
                            disabled={isExistingVehicle}
                            renderInput={autocompleteRender({
                                label: t("Model"),
                                placeholder: errors.includes("model") ? `${t("Model")} ${t("required")}` : `${t("Select")} ${t("Model")}`,
                                error: errors.includes("model"),
                                required: requiredFields.includes('model')
                            })}
                            value={selectedVehicle?.model ? selectedVehicle.model.toString() : ''}
                        />
                        {recallsToggledOn || isRecallsCategorySelected || selectedVehicle?.vin?.length
                            ? <div key="vin"
                                   className={recallsToggledOn && !isRecallsCategorySelected ? classes.vinWrapper : ""}
                                   style={{...orderMapStyles.vin, display: 'grid'}}>
                                <TextField
                                    onChange={handleVINChange("vin")}
                                    label={recallsToggledOn && !isRecallsCategorySelected
                                        ? t("OPTIONAL: Please enter your VIN to check for open Safety Recalls")
                                        : `${t("VIN")}${isRecallsCategorySelected ? "" : `(${ t("Optional")})`}`
                                    }
                                    name={"vin"}
                                    error={errors.includes("vin")}
                                    required={requiredFields.includes("vin") || isRecallsCategorySelected}
                                    fullWidth
                                    disabled={(userType === EUserType.Existing && !!selectedVehicle?.vin?.length && isExistingVin)}
                                    value={selectedVehicle ? selectedVehicle.vin : ""}
                                    placeholder={errors.includes("vin")
                                        ? `${t("VIN")} ${t("required")}`
                                        : `${t("Type")} ${t("VIN")} ${isRecallsCategorySelected ? "" : `(${t("Optional")})`}`}
                                />
                            </div> : null}
                    </SelectWrapper>
                }
                <ActionButtons
                    onBack={handleBack}
                    onNext={handleSubmit}
                    prevDisabled={isLoading}
                    nextDisabled={isNextDisabled || isLoading}
                    nextLabel={isRecallsCategorySelected ? isXS ? t("Check Recalls") : t("Check for Recalls") : t("Next")}
                />
                <RecallsByVinModal
                    open={isOpen}
                    onClose={onClose}
                    handleNext={onNextForRecalls}
                    handleAddServices={handleAddServices}
                    onDeclineRecalls={handleDeclineRecalls}
                    isRecallsCategorySelected={isRecallsCategorySelected}
                />
                <NoRecallsModal open={isNoRecallsOpen} onClose={onNoRecallsClose} handleNext={handleDeclineRecalls}/>
            </StepWrapper>
        );
    };