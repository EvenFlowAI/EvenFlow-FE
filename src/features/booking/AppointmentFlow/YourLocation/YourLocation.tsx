import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {StepWrapper} from "../../../../components/styled/StepWrapper";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {Autocomplete} from '@mui/material';
import {ActionButtons} from "../../ActionButtons/ActionButtons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import GooglePlacesAutocomplete, {geocodeByPlaceId} from 'react-google-places-autocomplete';
import {
    clearAppointmentData,
    loadAncillaryPriceByZip,
    loadFilteredZip,
    setAddress,
    setCity,
    setCurrentFrameScreen,
    setDefaultVisitCenterOption,
    setPoliticalState,
    setServiceTypeOption,
    setShowServiceCentersList,
    setSideBarSteps,
    setStreetName,
    setWelcomeScreenView,
    setZipCode,
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {
    EAncillaryType,
    EServiceType,
    IAncillaryByZipRequest,
    TAncillaryPriceByZip
} from "../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import AncillaryPriceModal from "./AncillaryPriceModal/AncillaryPriceModal";
import UnavailableServiceModal from "./UnavailableServiceModal/UnavailableServiceModal";
import {KeyboardArrowDown} from "@mui/icons-material";
import {TActionProps, TArgCallback, TView} from "../../../../types/types";
import {useHistory, useParams} from "react-router-dom";
import {setServiceWarningOpen, setSlotsWarningOpen} from "../../../../store/reducers/modals/actions";
import {checkPodChanged} from "../../../../store/reducers/appointments/actions";
import {ILoadedVehicle} from "../../../../api/types";
import {IFirstScreenOption} from "../../../../store/reducers/serviceTypes/types";

import {parseGeoCode} from "./utils";
import {useModal} from "../../../../hooks/useModal/useModal";
import {useException} from "../../../../hooks/useException/useException";
import {useCurrentUser} from "../../../../hooks/useCurrentUser/useCurrentUser";
import {Routes} from "../../../../routes/constants";
import {SelectWrapper, useAutocompleteStyles, useStyles} from "./styles";

type TYourLocationProps = TActionProps & {
    setNeedToShowServiceSelection: Dispatch<SetStateAction<boolean>>;
    onGoToFirstScreen: TArgCallback<TView>;
    onUpdateAppointment: (car: ILoadedVehicle) => Promise<void>;
}

const YourLocation: React.FC<React.PropsWithChildren<React.PropsWithChildren<TYourLocationProps>>> = ({onBack, onNext, setNeedToShowServiceSelection, onGoToFirstScreen, onUpdateAppointment}) => {
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
        prevSelectedOption,
        ancillaryPriceLoading,
        sideBarSteps,
        advisor,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const {isAdvisorAvailable, isAppointmentTimingAvailable, config} = useSelector((state: RootState) => state.bookingFlowConfig);

    const [zip, setZip] = useState<string>("");
    const [isFormChecked, setFormChecked] = useState<boolean>(false);

    const {isOpen, onClose, onOpen} = useModal();
    const {isOpen: isUnavailableOpen, onClose: onUnavailableClose, onOpen: onUnavailableOpen} = useModal();
    const dispatch = useDispatch();
    const showError = useException();
    const { classes  } = useStyles();
    const error = isFormChecked && !zip;
    const { classes: autocompleteClasses } = useAutocompleteStyles({"error": error});
    const {t} = useTranslation();
    const currentUser = useCurrentUser();
    const {id} = useParams<{id: string}>();
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
         if (!zip && zipCodeValue) {
             setZip(zipCodeValue)
         }
    }, [zipCodeValue])

    useEffect(() => {
        if (customerLoadedData?.address && !address) {
            dispatch(setAddress(customerLoadedData?.address?.fullAddress  ?? customerLoadedData?.address?.originalFullAddress ?? null))
        }
        if (customerLoadedData?.address?.zipCode && !zipCodeValue) {
            dispatch(setZipCode(customerLoadedData?.address?.zipCode))
        }
    }, [customerLoadedData, address, zipCodeValue])

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
            dispatch(setCurrentFrameScreen(isAdvisorAvailable && !advisor
                ? 'consultantSelection'
                : isAppointmentTimingAvailable
                    ? "appointmentTiming"
                    : 'appointmentSelection'))
        }
    }

    const onNextStep = () => {
        if (customerLoadedData?.isUpdating) {
            if ((mobileServiceSelected || mobileServiceChanged) && editingPosition === 'serviceOption') {
                handleManagingFlow();
            } else {
                changedToPickUpFromSlots || (appointmentByKey?.address?.zipCode && zipCodeValue !== appointmentByKey?.address?.zipCode)
                    ? scProfile && dispatch(checkPodChanged(scProfile.id, showError))
                    : handleManagingFlow();
            }
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
        if (list.includes(postalCode)) setZip(postalCode)
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
        dispatch(setAddress(appointmentByKey?.address?.fullAddress ?? null))
        dispatch(setZipCode(appointmentByKey?.address?.zipCode ?? ""))
    }

    const setPrevSelectedOption = () => {
        if (prevSelectedOption) {
            dispatch(setServiceTypeOption(prevSelectedOption))
            goToSlotsSelection(prevSelectedOption)
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
                    freeSolo
                    isOptionEqualToValue={(o, v) => o === v}
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
            <ActionButtons onBack={handleBack} onNext={handleNext} nextLabel={t("Next")} loading={ancillaryPriceLoading}/>
            <AncillaryPriceModal
                onNext={onNextStep}
                open={isOpen}
                onClose={onClose}
                onBackToSelectSlotsForVisitCenter={onGoToSlotsForVisitCenter}
                onVisitCenter={setDefaultVisitCenter}/>
            <UnavailableServiceModal
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