import React from 'react';
import {ConfirmationTitle} from "../Title";
import {styled} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {ReactComponent as SpecialServiceIcon} from "../../../../assets/img/specail_label.svg";

const Price = styled('div')({
    marginTop: 8,
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: "bold",
})

const SpecialLabel = styled('div')({
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center',
    color: "#008331",
    fontWeight: 'bold',
    fontSize: 16,
    "& .icon": {
        marginRight: 10,
    }
})

export const SelectedPrice = () => {
    const {appointment, scProfile} = useSelector((state: RootState) => state.appointment);
    const {t} = useTranslation();
    return (
        <div>
            <ConfirmationTitle>{t("Selected Price")}</ConfirmationTitle>
            <Price>
                {appointment?.price.value ?
                    <span>${scProfile?.isRoundPrice
                        ? appointment.price.value
                        : appointment.price.value.toFixed(2)}
                    </span>
                    : t('Service items will be quoted at dealership')
                }
                {appointment?.serviceRequestPrices?.find(item => !!item.offer)
                    ? <SpecialLabel><SpecialServiceIcon className="icon"/>{t("Service special applied")}</SpecialLabel>
                    : null}
            </Price>
        </div>
    );
};