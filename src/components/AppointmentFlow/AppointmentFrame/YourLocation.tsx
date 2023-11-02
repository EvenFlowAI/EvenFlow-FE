import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {StepWrapper} from "./StepWrapper";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {Actions} from "./Actions";
import {TActionProps} from "./types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import GooglePlacesAutocomplete, {geocodeByPlaceId} from 'react-google-places-autocomplete';
import {
    clearAppointmentData,
    loadAncillaryPriceByZip,
    loadFilteredZip,
    setCity,
    setPoliticalState,
    setAddress,
    setCurrentFrameScreen,
    setServiceTypeOption,
    setShowServiceCentersList,
    setSideBarSteps,
    setStreetName,
    setWelcomeScreenView,
    setZipCode, setDefaultVisitCenterOption
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {makeStyles} from "@material-ui/core/styles";
import {
    EAncillaryType,
    EServiceType,
    IAncillaryByZipRequest,
    TAncillaryPriceByZip
} from "../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {styled, Theme} from "@material-ui/core";
import DisplayAncillaryPrice from "../../Modals/DisplayAncillaryPrice/DisplayAncillaryPrice";
import {useCurrentUser, useException, useModal} from "../../../utils/hooks";
import UnavailableService from "../../Modals/InavailableService/UnavailableService";
import {KeyboardArrowDown} from "@material-ui/icons";
import {TArgCallback} from "../../../types/types";
import {TView} from "../../Welcome/types";
import {Routes} from "../../../config/routes";
import {useHistory, useParams} from "react-router-dom";
import {setServiceWarningOpen, setSlotsWarningOpen} from "../../../store/reducers/modals/actions";
import {checkPodChanged} from "../../../store/reducers/appointments/actions";
import {ILoadedVehicle} from "../../../api/types";
import {IFirstScreenOption} from "../../../store/reducers/serviceTypes/types";
import {parseGeoCode} from "./utils";

export const SelectWrapper = styled('div')(({theme}) => ({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "47% 47%",
    justifyContent: 'space-between',
    "& .label": {
        fontWeight: 700,
        margin: '0 0 4px 0',
        textTransform: 'uppercase',
        fontSize: 12,
    },
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "100%",
        gap: "20px",
    }
}));

type TYourLocationProps = TActionProps & {
    setNeedToShowServiceSelection: Dispatch<SetStateAction<boolean>>;
    onGoToFirstScreen: TArgCallback<TView>;
    onUpdateAppointment: (car: ILoadedVehicle) => Promise<void>;
}

const useStyles = makeStyles(() => ({
    select: {
        '& > div': {
            borderRadius: 0,
            backgroundColor: '#F7F8FB',
            padding: 2,
            border: "1px solid #DADADA",
            '& > div > div': {
                fontSize: '1rem',
                color: '#212121',
                backgroundColor: 'transparent',
            },
        },
    },
    emptySelect: {
        '& > div': {
            borderRadius: 0,
            backgroundColor: '#F7F8FB',
            padding: 2,
            border: "1px solid #DADADA",
            '& > div > div': {
                fontSize: '1rem',
            },
        }
    },
    errorSelect: {
        '& > div': {
            borderRadius: 0,
            backgroundColor: '#F7F8FB',
            padding: 2,
            border: "1px solid red",
            '& > div > div': {
                fontSize: '1rem',
                color: '#ff00006b',
                opacity: 1
            }
        },
    }
}))

export interface TStyleProps {
    error: boolean;
}

const useAutocompleteStyles = makeStyles<Theme, TStyleProps>(() => ({
    root: {
        "& input::placeholder": {
            color: props => props.error ? "red" : 'black'
        },
    },
    popupIndicator: {
        marginRight: 8
    },
}))

const YourLocation: React.FC<TYourLocationProps> = ({onBack, onNext, setNeedToShowServiceSelection, onGoToFirstScreen, onUpdateAppointment}) => {
    const [zip, setZip] = useState<string>("");
    const [isFormChecked, setFormChecked] = useState<boolean>(false);
    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const {
        zipCode: zipCodeValue,
        address,
        filteredZipCodes,
        serviceTypeOption,
        selectedVehicle,
        appointmentByKey,
        editingPosition,
        serviceOptionChangedFromSlotPage,
        selectedServiceOptions,
        ancillaryPriceLoading,
        sideBarSteps,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const {isAdvisorAvailable, config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {isOpen, onClose, onOpen} = useModal();
    const {isOpen: isUnavailableOpen, onClose: onUnavailableClose, onOpen: onUnavailableOpen} = useModal();
    const dispatch = useDispatch();
    const showError = useException();
    const classes = useStyles();
    const styleProps:TStyleProps = {error: isFormChecked && !zip};
    const autocompleteClasses = useAutocompleteStyles(styleProps);
    const {t} = useTranslation();
    const currentUser = useCurrentUser();
    const {id} = useParams();
    const history = useHistory();

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

    const placeholder = useMemo(() => serviceTypeOption?.type === EServiceType.PickUpDropOff
        ? t('Enter pick up address')
        : t('Enter your requested location'), [serviceTypeOption])

    const mobileServiceSelected = useMemo(() => serviceTypeOption?.type === EServiceType.MobileService
        && appointmentByKey?.serviceTypeOption
        && appointmentByKey?.serviceTypeOption?.type !== EServiceType.MobileService, [serviceTypeOption, appointmentByKey]);
    const mobileServiceChanged = useMemo(() => serviceTypeOption?.type !== EServiceType.MobileService
        && appointmentByKey?.serviceTypeOption?.type === EServiceType.MobileService, [serviceTypeOption, appointmentByKey]);
    const managedToPickUp = useMemo(() => serviceTypeOption?.type === EServiceType.PickUpDropOff
        && appointmentByKey?.serviceTypeOption
        && appointmentByKey?.serviceTypeOption?.type !== EServiceType.PickUpDropOff, [serviceTypeOption, appointmentByKey]);
    const changedToPickUpFromSlots = useMemo(() => serviceOptionChangedFromSlotPage && serviceTypeOption?.type === EServiceType.PickUpDropOff,
        [serviceOptionChangedFromSlotPage, serviceTypeOption]);

    useEffect(() => {
        setZip(zipCodeValue ?? "")
    }, [zipCodeValue])

    const clearSelectedData = () => {
        if (!customerLoadedData?.isUpdating) {
            dispatch(setSideBarSteps(serviceType === EServiceType.VisitCenter ? ["serviceNeeds"] : ["location"]));
            dispatch(clearAppointmentData())
        }
    }

    const handleManagingFlow = () => {
        if ((mobileServiceSelected || mobileServiceChanged) && editingPosition === 'serviceOption') {
            dispatch(setServiceWarningOpen(true))
        } else if (managedToPickUp) {
            dispatch(setSlotsWarningOpen(true))
        } else {
            scProfile && dispatch(checkPodChanged(scProfile.id, showError))
        }
    }

    const goToSlotsSelection = (prevOption?: IFirstScreenOption|undefined) => {
        if (prevOption) {
            const prevConfig = config.find(el => el.serviceType === prevOption.type)
            const advisorsStepNeeded = prevConfig?.advisorSelection && sideBarSteps[sideBarSteps.length - 1] === "consultantSelection";
            dispatch(setCurrentFrameScreen( advisorsStepNeeded
                ? 'consultantSelection'
                : prevConfig?.appointmentSelection
                    ? "appointmentTiming"
                    : 'appointmentSelection'))
        } else {
            dispatch(setCurrentFrameScreen(isAdvisorAvailable ? 'consultantSelection' : 'appointmentSelection'))
        }
    }

    const onNextStep = () => {
        if (customerLoadedData?.isUpdating) {
            changedToPickUpFromSlots || zipCodeValue !== appointmentByKey?.zipCode
                ? scProfile && dispatch(checkPodChanged(scProfile.id, showError))
                : handleManagingFlow();
        } else {
            changedToPickUpFromSlots
                ? goToSlotsSelection()
                : onNext();
        }
    }

    const clearAddress = () => {
        dispatch(setAddress(null));
        dispatch(setPoliticalState(""))
        dispatch(setCity(""))
        dispatch(setZipCode(""));
    }

    const onGetZipCodesList = (list: string[], postalCode: string) => {
        if (list.includes(postalCode)) dispatch(setZipCode(postalCode))
    }

    const handleChangeAddress = async (e: any) => {
        if (!serviceOptionChangedFromSlotPage) clearSelectedData();
        setFormChecked(false);
        dispatch(setAddress(e ?? null))
        dispatch(setZipCode(''))
        if (e?.value?.place_id && e?.label) {
           geocodeByPlaceId(e.value.place_id).then(res => {
               const data = parseGeoCode(res[0].address_components, e.label, e.value?.structured_formatting?.main_text, e.value?.structured_formatting?.secondary_text)
               if (data.city) dispatch(setCity(data.city))
               if (data.state) dispatch(setPoliticalState(data.state))
               if (data.address) dispatch(setStreetName(data.address))
               if (data.postalCode && scProfile) {
                   dispatch(loadFilteredZip({serviceCenterId: scProfile.id, search: data.postalCode}, onGetZipCodesList))
               }
            })
        }
    }
    const handleChangeZip = (e: React.ChangeEvent<{}>, option: string | null) => {
        if (!serviceOptionChangedFromSlotPage) clearSelectedData();
        setFormChecked(false);
        setZip(option ?? "");
    }

    const setPrevServiceType = () => {
        if (mobileServiceSelected || mobileServiceChanged) {
            selectedVehicle && onUpdateAppointment(selectedVehicle)
        }
    }

    const restoreAddress = () => {
        dispatch(setAddress(appointmentByKey?.address ?? null))
        dispatch(setZipCode(appointmentByKey?.zipCode ?? ""))
    }

    const setPrevSelectedOption = () => {
        if (selectedServiceOptions.length) {
            const prevOption = selectedServiceOptions[selectedServiceOptions.length - (selectedServiceOptions.length > 1 ? 2 : 1)];
            if (prevOption) {
                dispatch(setServiceTypeOption(prevOption))
                goToSlotsSelection(prevOption)
            }
        }
    }

    const onGoToSlotsForVisitCenter = () => {
        appointmentByKey
            ? restoreAddress()
            : clearAddress()
        setPrevSelectedOption()
    }

    const goToFirstScreen = async () => {
        await dispatch(setShowServiceCentersList(false))
        await dispatch(setWelcomeScreenView("serviceSelect"));
        history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
    }

    const onBackFromManage = () => {
        setPrevServiceType()
        restoreAddress()
        if (editingPosition === 'address') {
            dispatch(setCurrentFrameScreen('manageAppointment'))
        } else {
            goToFirstScreen().then()
        }
    }

    const handleFirstScreenForCustomer = (shouldSkipServiceTypeSelect: boolean, prevScreen: TView) => {
        setNeedToShowServiceSelection(!shouldSkipServiceTypeSelect)
        if (shouldSkipServiceTypeSelect) {
            if (customerLoadedData && selectedVehicle) {
                onBack()
            } else {
                history.push(`${Routes.EndUser.Welcome}/${id}?frame=1`)
            }
        } else {
            onGoToFirstScreen(prevScreen)
        }
    }

    const handleFirstScreenForAdmin = (prevScreen: TView) => {
        dispatch(setShowServiceCentersList(false));
        onGoToFirstScreen(prevScreen)
    }

    const handlePrevScreen = () => {
        const onlyVisitCenterExists = firstScreenOptions.length === 1 && firstScreenOptions[0].type === EServiceType.VisitCenter
        const shouldSkipServiceTypeSelect = !firstScreenOptions?.length || onlyVisitCenterExists;
        const prevScreen = shouldSkipServiceTypeSelect ? "select" : "serviceSelect";
        if (currentUser) {
            handleFirstScreenForAdmin(prevScreen)
        } else {
            handleFirstScreenForCustomer(shouldSkipServiceTypeSelect, prevScreen)
        }
    }

    const handleBack = () => {
        if (serviceOptionChangedFromSlotPage) {
            setPrevSelectedOption()
        } else {
            if (customerLoadedData?.isUpdating && appointmentByKey) {
                onBackFromManage()
            } else {
                clearAddress();
                clearSelectedData();
                handlePrevScreen();
            }
        }
    }

    const onSuccess = (data: TAncillaryPriceByZip) => {
        if (data.feeAmount === 0 && data.feeType === EAncillaryType.Amount) {
            onNextStep();
        } else {
            onOpen();
        }
    }

    const showValidationErrors = () => {
        if (!address) showError('"Address" is required');
        if (!zip?.length) showError('"Zip Code" is required');
    }

    const loadAncillaryPrice = () => {
        if (address && zip.length && scProfile) {
            dispatch(setZipCode(zip));
            const data: IAncillaryByZipRequest = {
                address: typeof address === 'string' ? address : address.label,
                zipCode: zip,
                serviceCenterId: scProfile?.id,
                serviceTypeOptionId: serviceTypeOption?.id ?? null,
            }
            dispatch(loadAncillaryPriceByZip(data, onSuccess, showError, onUnavailableOpen))
        }
    }

    const handleNext = () => {
        setFormChecked(true);
        showValidationErrors();
        loadAncillaryPrice();
    }

    const onInputChange = (e: React.ChangeEvent<{}>, value: string) => {
        if (scProfile) {
            dispatch(loadFilteredZip({serviceCenterId: scProfile.id, search: value}))
        }
    }

    const getPlaceholderLabel = (): string => {
        if (typeof address === 'string' && address.length) return address;
        if (address?.label) return address?.label;
        return isFormChecked ? t('Address is required') : placeholder
    }

    const setDefaultVisitCenter = async () => {
        await dispatch(setDefaultVisitCenterOption());
        await dispatch(clearAppointmentData());
        await dispatch(setSideBarSteps([]));
    }

    return (
        <StepWrapper>
            <SelectWrapper>
                <div style={{width: '100%'}}>
                    <p className="label">{t("Your Address")}</p>
                    <GooglePlacesAutocomplete
                        apiKey="AIzaSyCTy-LeuU4m1uoh1nhbUVZBC2G4HDUQQ04"
                        apiOptions={{ language: 'en-GB', region: 'us' }}
                        autocompletionRequest={{
                            componentRestrictions: {
                                country: ['us'],
                            },
                        }}
                        selectProps={{
                            addressValue: typeof address === 'string' && address.length ? address : address?.label ?? null,
                            className: typeof address === 'string' && address.length
                                ? classes.select
                                : !address?.label ?
                                    isFormChecked
                                        ? classes.errorSelect
                                        : classes.emptySelect
                                    : classes.select,
                            onChange: handleChangeAddress,
                            placeholder: getPlaceholderLabel(),
                            isClearable: true,
                            isSearchable: true,
                            key: address?.label || 'label',
                        }}
                    />
                </div>

                <Autocomplete
                    options={filteredZipCodes}
                    onChange={handleChangeZip}
                    fullWidth
                    classes={autocompleteClasses}
                    autoComplete={true}
                    onInputChange={onInputChange}
                    popupIcon={<KeyboardArrowDown htmlColor="#CCCCCC" />}
                    renderInput={autocompleteRender({
                        label: t('Your ZIP'),
                        placeholder: isFormChecked && !zip
                            ? t("zip code required")
                                : serviceTypeOption?.type === EServiceType.PickUpDropOff
                                 ? t("Enter pick up zip code")
                                : t("Enter your requested zip code"),
                        error: isFormChecked && !zip,
                        required: true,
                        key: zipCodeValue || "zipcode",
                    })}
                    value={zip}
                />

            </SelectWrapper>
            <Actions onBack={handleBack} onNext={handleNext} nextLabel={t("Next")} loading={ancillaryPriceLoading}/>
            <DisplayAncillaryPrice
                onNext={onNextStep}
                open={isOpen}
                onClose={onClose}
                onBackToSelectSlotsForVisitCenter={onGoToSlotsForVisitCenter}
                onVisitCenter={setDefaultVisitCenter}/>
            <UnavailableService
                open={isUnavailableOpen}
                onClose={onUnavailableClose}
                setFormChecked={setFormChecked}
                onBackToServiceOption={goToFirstScreen}
                onBackToSelectSlotsForVisitCenter={onGoToSlotsForVisitCenter}
                onVisitCenter={setDefaultVisitCenter}/>
        </StepWrapper>
    );
};

export default YourLocation;