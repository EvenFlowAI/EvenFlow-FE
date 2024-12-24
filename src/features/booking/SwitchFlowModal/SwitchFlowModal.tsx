import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../../components/modals/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {useTranslation} from "react-i18next";
import {TextWrapper, useStyles} from "./styles";
import Consultant from "./Consultant/Consultant";
import Transportation from "./Transportation/Transportation";
import {Button, Grid} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {EAppointmentTimingType} from "../../../store/reducers/appointment/types";
import UserLocation from "../../../components/UserLocation/UserLocation";
import {IServiceConsultant, ITransportation} from "../../../api/types";
import Timing from "./Timing/Timing";
import {TParsableDate} from "../../../types/types";
import Calendar from "./Calendar/Calendar";
import {
    setCity,
    setPoliticalState,
    setStreetName, setTime, setTiming,
    updateAppointmentDetails
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {geocodeByPlaceId} from "react-google-places-autocomplete";
import {parseGeoCode} from "../AppointmentFlow/Screens/YourLocation/utils";
import {IFirstScreenOption} from "../../../store/reducers/serviceTypes/types";

const SwitchFlowModal: React.FC<DialogProps&{selectedOption: IFirstScreenOption|null}> = ({open, onClose, selectedOption}) => {
    const {
        serviceTypeOption,
        selectedTiming,
        transportation,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig)
    const [consultant, setConsultant] = useState<IServiceConsultant|null>(null)
    const [transportationOption, setTransportationOption] = useState<ITransportation|null>(null);
    const [timingType, setTimingType] = useState<EAppointmentTimingType>(EAppointmentTimingType.FirstAvailable);
    const [zip, setZip] = useState<string>("");
    const [userAddress, setUserAddress] = useState<any>(null);
    const [selectedTime, setSelectedTime] = useState<TParsableDate>(null);
    const [isCalendarOpen, setCalendarOpen] = useState<boolean>(false);
    const {t} = useTranslation();
    const {classes} = useStyles();
    const dispatch = useDispatch();

    const newConfig = config.find(item => item.serviceType === selectedOption?.type);

    const isAdvisorVisible = newConfig?.advisorSelection;
    const isDateSelectionOn = newConfig?.appointmentSelection && selectedOption?.type !== EServiceType.PickUpDropOff
    const isTransportationsVisible = Boolean(newConfig?.transportationNeeds) && !selectedOption?.transportationOption;
    const isAddressVisible = selectedOption?.type === EServiceType.PickUpDropOff

    useEffect(() => {
        if (!isDateSelectionOn) {
            dispatch(setTiming(EAppointmentTimingType.FirstAvailable))
            dispatch(setTime(null))
        }
    }, [transportation])

    const onCancel = () => {
        onClose();
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
            date: selectedTime,
            timing: timingType,
            transportation: transportationOption,
            zip,
            serviceTypeOption: selectedOption,
        }))
        onClose();
    }

    const onClickNext = () => {
        if (selectedTiming === EAppointmentTimingType.PreferredDate) {
            setCalendarOpen(true)
        } else {
            handleNextStep()
        }
    }

    return (
        <BaseModal open={open} onClose={onCancel} width={700}>
            <DialogTitle onClose={onCancel} style={{fontSize: 24, padding: "16px 36px 0 36px"}}>
                {t("We need additional information to schedule your appointment", {serviceName: serviceTypeOption?.name ?? ''})}
            </DialogTitle>
            <DialogContent style={{padding: "0 36px"}}>
                <Grid container>
                    { isAddressVisible
                        ? <>
                            <Grid item xs={12}>
                                <TextWrapper>{t("Where do you want to be picked up?")}</TextWrapper>
                            </Grid>
                            <Grid item xs={12}>
                                <UserLocation zip={zip} setZip={setZip} userAddress={userAddress} setUserAddress={setUserAddress}/>
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
                                    newOption={selectedOption}
                                    consultant={consultant}
                                    setConsultant={setConsultant}
                                    isVisible
                                    address={userAddress}
                                    zipCode={zip}
                                    disabled={serviceTypeOption?.type === EServiceType.PickUpDropOff && (!userAddress || !zip)}/>
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
                                    isVisible
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
                                    disabled={serviceTypeOption?.type === EServiceType.PickUpDropOff && (!userAddress || !zip)}
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
                <Button variant="contained" onClick={onClickNext} style={{width: 145, marginLeft: 16}}>
                    {t("Next")}
                </Button>
            </DialogActions>
            <Calendar
                time={selectedTime}
                setTime={setSelectedTime}
                isCalendarOpen={isCalendarOpen}
                setCalendarOpen={setCalendarOpen}
                onAccept={handleNextStep}/>
        </BaseModal>
    );
};

export default SwitchFlowModal;