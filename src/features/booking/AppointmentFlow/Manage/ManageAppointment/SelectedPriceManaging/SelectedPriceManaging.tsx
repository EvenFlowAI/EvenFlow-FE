import React from 'react';
import {
    AppointmentConfirmationTitle
} from "../../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {Price} from "./styles";
import {ConfirmationItemWrapper} from "../../../../../../components/styled/ConfirmationItemWrapper";
import {EPricingDisplayType} from "../../../../../../store/reducers/pricingSettings/types";

export const SelectedPriceManaging = () => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {appointmentRequestsPrices} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    const price = appointmentRequestsPrices
        .reduce((prev, current) => prev + (current.priceValue ?? 0),0)
    const noDefinedPriceExists = appointmentRequestsPrices
        .find(el => !el.priceValue || el.pricingDisplayType === EPricingDisplayType.Suppressed)
    return (
        <ConfirmationItemWrapper>
            <AppointmentConfirmationTitle>{t("Selected Price")}</AppointmentConfirmationTitle>
            <Price>
                {price > 0 && !noDefinedPriceExists
                    ? <span>${scProfile?.isRoundPrice
                        ? price
                        : price.toFixed(2)}
                    </span>
                    : t('A full quote will be provided at the dealership')
                }
                {/*todo uncomment for offer new functionality*/}
                {/*{appointment?.serviceRequestPrices?.find(item => !!item.offer)*/}
                {/*    ? <SpecialLabel><SpecialServiceIcon className="icon"/>{t("Service special applied")}</SpecialLabel>*/}
                {/*    : null}*/}
            </Price>
        </ConfirmationItemWrapper>
    );
};