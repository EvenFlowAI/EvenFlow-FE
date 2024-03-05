import React from 'react';
import {useTranslation} from "react-i18next";
import {IOfferForCategory} from "../../../../../../api/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {EOfferType} from "../../../../../../store/reducers/offers/types";

type TProps = {
    price: number|undefined;
    offer?: IOfferForCategory;
}

const CardPrice: React.FC<TProps> = ({price, offer}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {t} = useTranslation();
    return !!price
        ? <div className="priceWrapper">
            <span className="text">{t("Starting At")}</span>
            <span
                className={offer
                    ? offer.type === EOfferType.AmountOff
                        ? "blueStrikePrice"
                        : "bluePrice"
                    : "price" }>
                ${scProfile?.isRoundPrice ? price : price.toFixed(2)}
            </span>
        </div>
        : null;
};

export default CardPrice;