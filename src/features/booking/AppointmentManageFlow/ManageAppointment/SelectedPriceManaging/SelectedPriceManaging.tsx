import React from 'react';
import {AppointmentConfirmationTitle} from "../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {Price} from "./styles";
import {ConfirmationItemWrapper} from "../../../../../components/styled/ConfirmationItemWrapper";

export const SelectedPriceManaging = () => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {appointmentRequestsPrices} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    const price = appointmentRequestsPrices
        .reduce((prev, current) => prev + (current.priceValue ?? 0),0)

    return (
        <ConfirmationItemWrapper>
            <AppointmentConfirmationTitle>{t("Selected Price")}</AppointmentConfirmationTitle>
            <Price>
                {price > 0
                    ? <span>${scProfile?.isRoundPrice
                        ? price
                        : price.toFixed(2)}
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