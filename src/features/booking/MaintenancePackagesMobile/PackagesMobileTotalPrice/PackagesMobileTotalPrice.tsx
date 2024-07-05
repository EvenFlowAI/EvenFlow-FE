import React, {useMemo} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {RadioButtonChecked, RadioButtonUnchecked} from "@mui/icons-material";
import {EPackagePricingType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {EMaintenanceOptionType, IPackageOptions} from "../../../../api/types";
import {useTranslation} from "react-i18next";
import {PriceWrapper} from "./styles";

type TProps = {
    isUpsellPrice: boolean,
    text: string,
    price: number,
    complimentaryPrice?: number,
    upsellPrice?:number,
    type: EMaintenanceOptionType,
    handleClick: (type: EMaintenanceOptionType, packagePricingType: EPackagePricingType) => void,
    withUpsells?: boolean;
    totalMaintenanceValue: number;
    packagePricingType: EPackagePricingType|null;
    selectedPackage: IPackageOptions|null;
}

const PackagesMobileTotalPrice: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
                                                handleClick,
                                                type,
                                                isUpsellPrice,
                                                text,
                                                price,
                                                complimentaryPrice,
                                                upsellPrice,
                                                withUpsells,
                                                totalMaintenanceValue,
                                                packagePricingType,
                                                selectedPackage
                                            }) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {t} = useTranslation();

    const selected = useMemo(() => {
        return type === selectedPackage?.type
            && packagePricingType === (isUpsellPrice
                ? EPackagePricingType.PriceWithFee
                : EPackagePricingType.BasePrice)
    }, [type, selectedPackage, packagePricingType, isUpsellPrice]);

    const showDetails = Boolean(scProfile?.isShowPriceDetails && complimentaryPrice && complimentaryPrice > 0);
    const defaultString = `${t("Total")} (${t("excluding taxes & fees")})`;

    const prevPrice = useMemo(() => scProfile?.isRoundPrice
        ? Number(totalMaintenanceValue) + (complimentaryPrice ?? 0)
        : (Number(totalMaintenanceValue) + (complimentaryPrice ?? 0)).toFixed(2), [scProfile, price, complimentaryPrice, totalMaintenanceValue]);
    const uniquePrice = useMemo(() => scProfile?.isRoundPrice
        ? price
        : price.toFixed(2), [scProfile, price]);
    const upsellPrevPrice = useMemo(() => scProfile?.isRoundPrice
        ? +prevPrice + (upsellPrice ?? 0)
        : (+prevPrice + (upsellPrice ?? 0)).toFixed(2), [scProfile, prevPrice, upsellPrice])
    const upsellUniquePrice = useMemo(() => scProfile?.isRoundPrice
        ? +uniquePrice + (upsellPrice ?? 0)
        : (+uniquePrice + (upsellPrice ?? 0)).toFixed(2), [scProfile, uniquePrice, upsellPrice])

    return (
        <PriceWrapper
            isUpsellPrice={isUpsellPrice}
            isSelected={selected}
            isShowPriceDetails={showDetails}
            onClick={() => handleClick(type, isUpsellPrice ? EPackagePricingType.PriceWithFee : EPackagePricingType.BasePrice)}
        >
            <div className="radio">
                {selected ? <RadioButtonChecked/> : <RadioButtonUnchecked/>}
            </div>
            <div className="text">{text && withUpsells ? text : isUpsellPrice ? "" : defaultString}</div>
            <div className="price">
                {showDetails ?
                    <React.Fragment>
                        <div className="prevPrice">${isUpsellPrice ? upsellPrevPrice : prevPrice}</div>
                        <div className="currentPrice">${isUpsellPrice ? upsellUniquePrice : uniquePrice}</div>
                    </React.Fragment>
                    : <div className="uniquePrice">
                        ${isUpsellPrice ? upsellUniquePrice : uniquePrice}
                    </div>
                }
            </div>
        </PriceWrapper>
    );
};

export default PackagesMobileTotalPrice;