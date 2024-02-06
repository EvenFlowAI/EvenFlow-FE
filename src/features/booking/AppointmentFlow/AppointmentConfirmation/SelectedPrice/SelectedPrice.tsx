import React from 'react';
import {AppointmentConfirmationTitle} from "../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {Price} from "./styles";
import {ConfirmationItemWrapper} from "../../../../../components/styled/ConfirmationItemWrapper";

export const SelectedPrice = () => {
    const {appointment, scProfile, serviceValetAppointment} = useSelector((state: RootState) => state.appointment);
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    return (
        <ConfirmationItemWrapper>
            <AppointmentConfirmationTitle>{t("Selected Price")}</AppointmentConfirmationTitle>
            <Price>
                {serviceTypeOption?.type === EServiceType.PickUpDropOff
                    ? serviceValetAppointment?.price.value ?
                        <span>${scProfile?.isRoundPrice
                            ? serviceValetAppointment.price.value + serviceValetAppointment.price.ancillaryPrice
                            : (serviceValetAppointment.price.value + serviceValetAppointment.price.ancillaryPrice).toFixed(2)}
                    </span>
                        : t('Service items will be quoted at dealership')
                    : appointment?.price.value ?
                        <span>${scProfile?.isRoundPrice
                            ? appointment.price.value + appointment.price.ancillaryPrice
                            : (appointment.price.value + appointment.price.ancillaryPrice).toFixed(2)}
                    </span>
                        : t('Service items will be quoted at dealership')
                }
                {/*todo uncomment for offer new functionality*/}
                {/*{appointment?.serviceRequestPrices?.find(item => !!item.offer)*/}
                {/*    ? <SpecialLabel><SpecialServiceIcon className="icon"/>{t("Service special applied")}</SpecialLabel>*/}
                {/*    : null}*/}
            </Price>
        </ConfirmationItemWrapper>
    );
};