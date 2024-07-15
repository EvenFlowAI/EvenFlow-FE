import React from 'react';
import {AppointmentConfirmationTitle} from "../../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {Wrapper} from "./styles";
import {ConfirmationItemWrapper} from "../../../../../../components/styled/ConfirmationItemWrapper";

export const Review = () => {
    const {
        advisor,
        transportation,
        serviceTypeOption,
    } = useSelector(({appointmentFrame}: RootState) => appointmentFrame)
    const {currentConfig} = useSelector(({bookingFlowConfig}: RootState) => bookingFlowConfig)
    const {t} = useTranslation();
    const transportationSelected = serviceTypeOption?.transportationOption || transportation;

    return (
        <ConfirmationItemWrapper>
            <AppointmentConfirmationTitle>{t("Appointment Details")}</AppointmentConfirmationTitle>
            <Wrapper>
                {transportationSelected
                    ? <li>Transportation needs: {transportationSelected?.description}</li>
                    : null}
                {currentConfig?.advisorSelection
                    ? <li>{t("Service Advisor")}: {advisor?.name ?? t("Any Available")}</li>
                    : null
                }
            </Wrapper>
        </ConfirmationItemWrapper>
    );
};