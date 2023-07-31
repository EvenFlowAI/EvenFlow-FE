import React, {useMemo} from 'react';
import {styled, Theme} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {EPackagePricingType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {EMaintenanceOptionType, IPackageOptions} from "../../../../api/types";
import {useTranslation} from "react-i18next";

const PriceWrapper = styled(({isUpsellPrice, isShowPriceDetails, isSelected, ...props}) =>
    (<div {...props}/>))<Theme, {isShowPriceDetails: boolean, isUpsellPrice?: boolean, isSelected: boolean}>(
    ({theme, isShowPriceDetails, isUpsellPrice, isSelected}) => ({
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '10% 50% 40%',
        border: `1px solid ${isSelected ? '#202021' : '#BDBDBD'}`,
        marginBottom: isUpsellPrice ? 0 : 10,
        marginTop: isUpsellPrice ? 0 : 10,
        "& .radio": {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: isUpsellPrice ?'#FFD966' : '#3E3E40',
            color: isUpsellPrice ? '#202021' : '#FFFFFF',
            padding: '10px 0 10px 0',
        },
        '& .text': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'right',
            fontSize: 16,
            fontWeight: 'bold',
            color: isUpsellPrice ? '#202021' : '#FFFFFF',
            background: isUpsellPrice ?'#FFD966' : '#3E3E40',
            padding: '10px 16px'
        },
        '& .price': {
            display: 'flex',
            justifyContent: "center",
            alignItems: 'center',
            flexDirection: isShowPriceDetails ? "column" : 'row',
            background: isUpsellPrice ? 'FFF2CC' : isSelected ? '#DADADA' : '#EFEFEF',
            padding: '10px 25px',
            "& .prevPrice": {
                color: '#202021',
                textDecoration: "line-through",
                fontWeight: 'bold',
                fontSize: 20,
            },
            "& .currentPrice": {
                color: "#D32F2F",
                fontSize: 20,
                fontWeight: 'bold',
            },
            "& .uniquePrice": {
                color: '#202021',
                fontWeight: 'bold',
                fontSize: 20,
            }
        },
    }))

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

const TotalPriceMobile: React.FC<TProps> = ({
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

export default TotalPriceMobile;