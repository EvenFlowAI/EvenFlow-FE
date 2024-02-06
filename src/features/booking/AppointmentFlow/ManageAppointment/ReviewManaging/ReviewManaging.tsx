import React, {useEffect} from 'react';
import {AppointmentConfirmationTitle} from "../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {Edit} from "@mui/icons-material";
import {
    setAdvisor,
    setCurrentFrameScreen,
    setEditingPosition,
    setServiceOptionChanged
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {Wrapper} from "./styles";
import {ConfirmationItemWrapper} from "../../../../../components/styled/ConfirmationItemWrapper";

export const ReviewManaging = () => {
    const {
        advisor,
        isAnyAdvisorSelected,
        transportation,
        serviceTypeOption,
        consultants,
        appointmentByKey
    } = useSelector(({appointmentFrame}: RootState) => appointmentFrame)
    const {
        currentConfig,
        isTransportationAvailable,
        isAdvisorAvailable,
    } = useSelector(({bookingFlowConfig}: RootState) => bookingFlowConfig)

    const {t} = useTranslation();
    const transportationSelected = serviceTypeOption?.transportationOption || transportation;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!advisor && !appointmentByKey?.advisor?.isAnySelected && !isAnyAdvisorSelected) {
            const selectedPreviouslyConsultant = appointmentByKey?.advisor?.id
                ? consultants.find(item => item.id === appointmentByKey?.advisor?.id)
                : undefined
            selectedPreviouslyConsultant && dispatch(setAdvisor(selectedPreviouslyConsultant))
        }
    }, [appointmentByKey, consultants, advisor, isAnyAdvisorSelected])

    const handleChangeAdvisor = () => {
        dispatch(setServiceOptionChanged(false))
        dispatch(setEditingPosition('advisor'));
        dispatch(setCurrentFrameScreen("consultantSelection"));
    }

    const handleChangeTransportation = () => {
        dispatch(setServiceOptionChanged(false))
        dispatch(setEditingPosition('transportation'));
        dispatch(setCurrentFrameScreen("transportationNeeds"));
    }

    return (
        <ConfirmationItemWrapper>
            <AppointmentConfirmationTitle>{t("Appointment Details")}</AppointmentConfirmationTitle>
            <Wrapper>
                {transportationSelected
                    ? <li style={{display: "flex"}}>Transportation needs: {transportationSelected?.description}
                        {isTransportationAvailable ? <Edit htmlColor="#142EA1" fontSize="small" onClick={handleChangeTransportation} style={{cursor: "pointer"}}/> : null}
                    </li>
                    : null}
                {currentConfig?.advisorSelection
                    ? <li style={{display: "flex"}}>{t("Service Advisor")}: {advisor?.name ?? t("Any Available")}
                        {isAdvisorAvailable ? <Edit htmlColor="#142EA1" fontSize="small" onClick={handleChangeAdvisor} style={{cursor: "pointer"}}/> : null}
                </li>
                    : null
                }
            </Wrapper>
        </ConfirmationItemWrapper>
    );
};