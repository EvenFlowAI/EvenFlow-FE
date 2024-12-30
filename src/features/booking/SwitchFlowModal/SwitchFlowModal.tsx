import React, {useEffect, useMemo, useState} from 'react';
import {DialogProps} from "../../../components/modals/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {useTranslation} from "react-i18next";
import {TextWrapper} from "./styles";
import Consultant from "./Consultant/Consultant";
import Transportation from "./Transportation/Transportation";
import {Button, Grid} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    EAncillaryType,
    EServiceType,
    IAncillaryByZipRequest,
    TAncillaryPriceByZip
} from "../../../store/reducers/appointmentFrameReducer/types";
import {EAppointmentTimingType} from "../../../store/reducers/appointment/types";
import UserLocation from "../../../components/UserLocation/UserLocation";
import {IServiceConsultant, ITransportation} from "../../../api/types";
import Timing from "./Timing/Timing";
import {TCallback, TParsableDate} from "../../../types/types";
import Calendar from "./Calendar/Calendar";
import {
    loadAncillaryPriceByZip,
    setCity,
    setFilteredZipCodes,
    setPoliticalState,
    setServiceTypeOption,
    setStreetName,
    setTime,
    setTiming,
    updateAppointmentDetails
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {geocodeByPlaceId} from "react-google-places-autocomplete";
import {parseGeoCode} from "../AppointmentFlow/Screens/YourLocation/utils";
import {useException} from "../../../hooks/useException/useException";
import AncillaryPriceModal from "../../../components/modals/booking/AncillaryPriceModal/AncillaryPriceModal";
import {useModal} from "../../../hooks/useModal/useModal";
import {IFirstScreenOption} from "../../../store/reducers/serviceTypes/types";
import UnavailableServiceModal from "./UnavailableServiceModal/UnavailableServiceModal";
import {selectAppointment, selectServiceValetAppointment} from "../../../store/reducers/appointment/actions";

type TProps = DialogProps & {
    selectedOption: IFirstScreenOption|null;
    onNext?: TCallback;
}

const SwitchFlowModal: React.FC<TProps> = ({open, onClose, selectedOption, onNext}) => {
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig)
    const {address, zipCode: zipCodeValue} = useSelector((state: RootState) => state.appointmentFrame)
    const {scProfile} = useSelector((state: RootState) => state.appointment)

    const [consultant, setConsultant] = useState<IServiceConsultant|null>(null)
    const [transportationOption, setTransportationOption] = useState<ITransportation|null>(null);
    const [timingType, setTimingType] = useState<EAppointmentTimingType>(EAppointmentTimingType.FirstAvailable);
    const [zip, setZip] = useState<string|null>(null);
    const [userAddress, setUserAddress] = useState<any>(null);
    const [selectedTime, setSelectedTime] = useState<TParsableDate>(null);
    const [isCalendarOpen, setCalendarOpen] = useState<boolean>(false);
    const [isAddressValid, setAddressValid] = useState<boolean>(selectedOption?.type !== EServiceType.PickUpDropOff)

    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {isOpen: isAncillaryPriceOpen, onOpen: onAncillaryPriceOpen, onClose: onAncillaryPriceClose} = useModal();
    const {isOpen: isUnavailableServiceOpen, onOpen: onUnavailableServiceOpen, onClose: onUnavailableServiceClose} = useModal();
    const showError = useException();

    const newConfig = config.find(item => item.serviceType === selectedOption?.type);

    const isAdvisorVisible = newConfig?.advisorSelection;
    const isDateSelectionOn = newConfig?.appointmentSelection && selectedOption?.type !== EServiceType.PickUpDropOff
    const isTransportationsVisible = Boolean(newConfig?.transportationNeeds) && !selectedOption?.transportationOption;
    const isAddressVisible = selectedOption?.type === EServiceType.PickUpDropOff;
    const nextButtonIsDisabled = useMemo(() => {
        return !isAddressValid || (isTransportationsVisible && !transportationOption)
    }, [isAddressValid, isTransportationsVisible, transportationOption])

    useEffect(() => {
        if (open && selectedOption) {
            const someFilterIsAvailable = isAddressVisible || isDateSelectionOn || isTransportationsVisible || isAdvisorVisible
            if (!someFilterIsAvailable) {
                dispatch(setServiceTypeOption(selectedOption))
            }
        }
    }, [isAddressVisible, isDateSelectionOn, isTransportationsVisible, isAdvisorVisible, selectedOption, open])

    useEffect(() => {
        if (userAddress && zip?.length === 5 && open) {
            loadAncillaryPrice(zip, userAddress)
        }
    }, [open])

    useEffect(() => {
        if (!isDateSelectionOn) {
            dispatch(setTiming(EAppointmentTimingType.FirstAvailable))
            dispatch(setTime(null))
            setTimingType(EAppointmentTimingType.FirstAvailable)
        }
    }, [isDateSelectionOn])

    useEffect(() => {
        if (!zip && zipCodeValue) {
            setZip(zipCodeValue)
        }
        if (!userAddress && address) {
            setUserAddress(address)
        }
    }, [open])

    const clearData = () => {
        setConsultant(null)
        setTransportationOption(null)
        setUserAddress(null)
        setZip(null)
        dispatch(setFilteredZipCodes([]));
        setCalendarOpen(false);
    }

    const clearDate = () => {
        setTimingType(EAppointmentTimingType.FirstAvailable)
        setSelectedTime(null)
    }

    const onCancel = () => {
        clearData()
        clearDate();
        onClose();
    }

    const handleClose = () => {
        clearData();
        onClose();
    }

    const clearPrevAppointments = () => {
        dispatch(selectAppointment(null))
        dispatch(selectServiceValetAppointment(null))
    }

    const handleNextStep = () => {
        if (userAddress?.place_id && userAddress?.label) {
            geocodeByPlaceId(userAddress.place_id).then(res => {
                const data = parseGeoCode(res[0].address_components, userAddress.label, userAddress?.structured_formatting?.main_text, userAddress?.structured_formatting?.secondary_text)
                if (data.city) dispatch(setCity(data.city))
                if (data.state) dispatch(setPoliticalState(data.state))
                if (data.address) dispatch(setStreetName(data.address))
            })
        }
        dispatch(updateAppointmentDetails({
            address: userAddress,
            advisor: consultant,
            date: timingType === EAppointmentTimingType.PreferredDate ? selectedTime : null,
            timing: timingType,
            transportation: transportationOption,
            zip: zip ?? '',
            serviceTypeOption: selectedOption,
        }))
        clearPrevAppointments();
        handleClose();
        onNext && onNext();
    }

    const onClickNext = () => {
        if (timingType === EAppointmentTimingType.PreferredDate) {
            setCalendarOpen(true)
        } else {
            handleNextStep()
        }
    }

    const onSuccess = (data: TAncillaryPriceByZip) => {
        if (data.feeAmount === 0 && data.feeType === EAncillaryType.Amount) {
            setAddressValid(true)
        } else {
            onAncillaryPriceOpen()
        }
    }

    const loadAncillaryPrice = (zipCode: string|null, address: any) => {
        if (scProfile) {
            if (address && zipCode?.length === 5 && selectedOption?.type === EServiceType.PickUpDropOff) {
                const data: IAncillaryByZipRequest = {
                    address: typeof address === 'string' ? address : address.label,
                    zipCode,
                    serviceCenterId: scProfile.id,
                    serviceTypeOptionId: selectedOption.id,
                }
                dispatch(loadAncillaryPriceByZip(data, onSuccess, showError, onUnavailableServiceOpen))
            }
        }
    }

    const onAncillaryPriceAccepted = () => {
        setAddressValid(true);
        onAncillaryPriceClose()
    }

    const onTryAnotherLocation = () => {
        setUserAddress(null);
        setZip(null);
        setAddressValid(false);
        onUnavailableServiceClose();
    }

    return (
        <BaseModal open={open} onClose={onCancel} width={700}>
            <DialogTitle onClose={onCancel} style={{fontSize: 24, padding: "16px 36px 0 36px"}}>
                {t("We need additional information to schedule your appointment", {serviceName: selectedOption?.name ?? ''})}
            </DialogTitle>
            <DialogContent style={{padding: "0 36px"}}>
                <Grid container>
                    { isAddressVisible
                            ? <>
                                <Grid item xs={12}>
                                    <TextWrapper>{t("Where do you want to be picked up?")}</TextWrapper>
                                </Grid>
                                <Grid item xs={12}>
                                    <UserLocation
                                        loadAncillaryPrice={loadAncillaryPrice}
                                        zip={zip}
                                        setZip={setZip}
                                        userAddress={userAddress}
                                        setUserAddress={setUserAddress}/>
                                </Grid>
                            </>
                        : null}
                    { isAdvisorVisible
                        ? <>
                            <Grid item xs={12}>
                                <TextWrapper>{t("Do you have a preferred Service Advisor?")}</TextWrapper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Consultant
                                    open={open}
                                    newOption={selectedOption}
                                    consultant={consultant}
                                    setConsultant={setConsultant}
                                    isVisible
                                    address={userAddress}
                                    zipCode={zip}
                                    disabled={selectedOption?.type === EServiceType.PickUpDropOff && !isAddressValid}/>
                            </Grid>
                        </>
                        : null}
                    { isTransportationsVisible
                        ? <>
                            <Grid item xs={12}>
                                <TextWrapper>{t("Do you need assistance with transportation?")}</TextWrapper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Transportation
                                    isTransportationAvailable={isTransportationsVisible}
                                    selectedTransportation={transportationOption}
                                    setSelectedTransportation={setTransportationOption}/>
                            </Grid>
                        </>
                        : null}
                    { isDateSelectionOn
                        ? <>
                            <Grid item xs={12}>
                                <TextWrapper>{t("When would you like your vehicle serviced?")}</TextWrapper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Timing
                                    disabled={selectedOption?.type === EServiceType.PickUpDropOff && (!userAddress || !zip)}
                                    timingType={timingType}
                                    setTimingType={setTimingType}
                                />
                            </Grid>
                        </>
                        : null}
                </Grid>
            </DialogContent>
            <DialogActions style={{padding: "32px 36px 25px 36px"}}>
                <Button variant="outlined" onClick={onCancel} style={{width: 145}}>
                    {t("Cancel")}
                </Button>
                <Button variant="contained" onClick={onClickNext} style={{width: 145, marginLeft: 16}} disabled={nextButtonIsDisabled}>
                    {t("Next")}
                </Button>
            </DialogActions>
            <Calendar
                time={selectedTime}
                setTime={setSelectedTime}
                isCalendarOpen={isCalendarOpen}
                setCalendarOpen={setCalendarOpen}
                onNext={handleNextStep}/>
            <AncillaryPriceModal
                backButtonText={t("Visit Center instead")}
                onNext={onAncillaryPriceAccepted}
                open={isAncillaryPriceOpen}
                onClose={onAncillaryPriceClose}
                serviceString={t("Pick Up / Drop Off")}
                onBack={onCancel}/>
            <UnavailableServiceModal
                onTryAnotherLocation={onTryAnotherLocation}
                open={isUnavailableServiceOpen}
                onClose={onUnavailableServiceClose}
                onVisitCenter={onCancel}
                serviceString={t("Pick Up / Drop Off")}
            />
        </BaseModal>
    );
};

export default SwitchFlowModal;