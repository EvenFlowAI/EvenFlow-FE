import React, {useEffect} from 'react';
import {DialogProps} from "../../../components/modals/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {useTranslation} from "react-i18next";
import {TextWrapper} from "./styles";
import SelectedConsultant
    from "../AppointmentFlow/Screens/AppointmentSlots/AppointmentFilters/SelectedConsultant/SelectedConsultant";
import SelectedTransportation
    from "../AppointmentFlow/Screens/AppointmentSlots/AppointmentFilters/SelectedTransportation/SelectedTransportation";
import {MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {EAppointmentTimingType} from "../../../store/reducers/appointment/types";
import {TextField} from "../../../components/formControls/TextFieldStyled/TextField";
import {setTiming} from "../../../store/reducers/appointmentFrameReducer/actions";
import UserLocation from "../../../components/UserLocation/UserLocation";

const SwitchFlowModal: React.FC<DialogProps> = ({open, onClose}) => {
    const {
        consultants,
        serviceTypeOption,
        selectedTiming,
        transportations,
        address,
        zipCode,
        isConsultantsLoading,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const { isAppointmentTimingAvailable, isAdvisorAvailable, isTransportationAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const isAdvisorVisible = Boolean(isAdvisorAvailable && consultants.length);
    const isDateSelectionOn = isAppointmentTimingAvailable && serviceTypeOption?.type !== EServiceType.PickUpDropOff;
    const isTransportationsVisible = Boolean(isTransportationAvailable && transportations.length)
    const isAddressVisible = serviceTypeOption?.type === EServiceType.PickUpDropOff

    useEffect(() => {
        if (!selectedTiming) dispatch(setTiming(EAppointmentTimingType.FirstAvailable))
    }, [selectedTiming])

    const onCancel = () => {
        onClose();
    }

    const onTimingChange = (e: SelectChangeEvent<number>) => {
        dispatch(setTiming(e.target.value as EAppointmentTimingType))
    }

    const onNext = () => {
        if (selectedTiming === EAppointmentTimingType.PreferredDate) {
            // todo open calendar
        } else {
            onClose();
        }
    }

    return (
        <BaseModal open={open} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>
                {t("We need additional information to schedule your appointment", {serviceName: serviceTypeOption?.name ?? ''})}
            </DialogTitle>
            <DialogContent>
                { isAddressVisible
                    ? <>
                        <TextWrapper>{t("Where do you want to be picked up?")}</TextWrapper>
                       <UserLocation/>
                    </>
                    : null}
                { isAdvisorVisible
                    ? <>
                        <TextWrapper>{t("Do you have a preferred Service Advisor?")}</TextWrapper>
                        <SelectedConsultant
                            loading={isConsultantsLoading}
                            isVisible
                            disabled={serviceTypeOption?.type === EServiceType.PickUpDropOff && (!address || !zipCode)}/>
                    </>
                    : null}
                { isTransportationsVisible
                    ? <>
                        <TextWrapper>{t("Do you need assistance with transportation?")}</TextWrapper>
                        <SelectedTransportation isVisible/>
                    </>
                    : null}
                { isDateSelectionOn
                        ? <>
                            <TextWrapper>{t("When would you like your vehicle serviced?")}</TextWrapper>
                            <Select
                                fullWidth
                                input={<TextField label="Appointment Search"/>}
                                disabled={!address || !zipCode}
                                id="timing"
                                name="timing"
                                value={selectedTiming ?? ""}
                                onChange={onTimingChange}>
                                <MenuItem key="firstAvailable" value={EAppointmentTimingType.FirstAvailable}>{t("First Available")}</MenuItem>
                                <MenuItem key="preferredDate" value={EAppointmentTimingType.PreferredDate}>{t("Preferred Date")}</MenuItem>
                            </Select>
                        </>
                        : null}
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </BaseModal>
    );
};

export default SwitchFlowModal;