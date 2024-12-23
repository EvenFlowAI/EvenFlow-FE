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

const SwitchFlowModal: React.FC<DialogProps> = ({open, onClose}) => {
    const {
        consultants,
        serviceTypeOption,
        selectedTiming,
        transportations,
        address,
        zipCode,
        isConsultantsLoading,
        advisor,
        transportation
    } = useSelector((state: RootState) => state.appointmentFrame);
    const { isAppointmentTimingAvailable, isAdvisorAvailable, isTransportationAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
    const [consultant, setConsultant] = useState<IServiceConsultant|null>(null)
    const [transportationOption, setTransportationOption] = useState<ITransportation|null>(null);
    const [timingType, setTimingType] = useState<EAppointmentTimingType>(EAppointmentTimingType.FirstAvailable);
    const [zip, setZip] = useState<string>("");
    const [userAddress, setUserAddress] = useState<any>(null);
    const [time, setTime] = useState<TParsableDate>(null);
    const [isCalendarOpen, setCalendarOpen] = useState<boolean>(false);
    const {t} = useTranslation();
    const {classes} = useStyles();
    const dispatch = useDispatch();

    const isAdvisorVisible = Boolean(isAdvisorAvailable && consultants.length);
    const isDateSelectionOn = isAppointmentTimingAvailable && serviceTypeOption?.type !== EServiceType.PickUpDropOff;
    const isTransportationsVisible = Boolean(isTransportationAvailable && transportations.length)
    const isAddressVisible = serviceTypeOption?.type === EServiceType.PickUpDropOff

    useEffect(() => {
        if (advisor) setConsultant(advisor)
        if (transportation) setTransportationOption(transportation)
    }, [advisor, transportation])

    const onCancel = () => {
        onClose();
    }


    const onNext = () => {
        if (selectedTiming === EAppointmentTimingType.PreferredDate) {
            // todo open calendar
        } else {
            onClose();
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
                                    consultant={consultant}
                                    setConsultant={setConsultant}
                                    loading={isConsultantsLoading}
                                    isVisible
                                    disabled={serviceTypeOption?.type === EServiceType.PickUpDropOff && (!address || !zipCode)}/>
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
                                    address={userAddress}
                                    zipCode={zip}
                                    timingType={timingType}
                                    setTimingType={setTimingType}
                                    time={time}
                                    setTime={setTime}
                                    isCalendarOpen={isCalendarOpen}
                                    setCalendarOpen={setCalendarOpen}
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
                <Button variant="contained" onClick={onNext} style={{width: 145, marginLeft: 16}}>
                    {t("Next")}
                </Button>
            </DialogActions>
        </BaseModal>
    );
};

export default SwitchFlowModal;