import React from 'react';
import {styled, Theme} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {EPackagePricingType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {EMaintenanceOptionType} from "../../../../api/types";

const PriceWrapper = styled(({isUpsellPrice, isShowPriceDetails, isSelected, ...props}) =>
    (<div {...props}/>))<Theme, {isShowPriceDetails: boolean, isUpsellPrice?: boolean, isSelected: boolean}>(
    ({theme, isShowPriceDetails, isUpsellPrice, isSelected}) => ({
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 3fr 2fr',
        borderTop: `1px solid ${isSelected ? '#202021' : '#BDBDBD'}`,
        borderBottom: `1px solid ${isSelected ? '#202021' : '#BDBDBD'}`,
        marginBottom: isUpsellPrice ? 0 : 10,
        "& .radio": {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: isUpsellPrice ?'#FFD966' : '#3E3E40',
            color: isUpsellPrice ? '#202021' : '#FFFFFF',
        },
        '& .text': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            color: isUpsellPrice ? '#202021' : '#FFFFFF',
            background: isUpsellPrice ?'#FFD966' : '#3E3E40',
        },
        '& .price': {
            display: 'flex',
            justifyContent: "center",
            alignItems: 'center',
            flexDirection: isShowPriceDetails ? "column" : 'row',
            background: isUpsellPrice ? 'FFF2CC' : isSelected ? '#DADADA' : '#EFEFEF',
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
}

const TotalPriceMobile: React.FC<TProps> = ({handleClick, type, isUpsellPrice, text, price, complimentaryPrice, upsellPrice}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {selectedPackage, packagePricingType} = useSelector((state: RootState) => state.appointmentFrame);

    const selected = type === selectedPackage?.type && packagePricingType === (isUpsellPrice ? EPackagePricingType.PriceWithFee : EPackagePricingType.BasePrice);
    const showDetails = Boolean(scProfile?.isShowPriceDetails && complimentaryPrice && complimentaryPrice > 0);

    const prevPrice = scProfile?.isRoundPrice
        ? price + (complimentaryPrice ?? 0)
        : (price + (complimentaryPrice ?? 0)).toFixed(2)
    const uniquePrice = scProfile?.isRoundPrice
        ? price
        : price.toFixed(2);
    const upsellPrevPrice = scProfile?.isRoundPrice
        ? +prevPrice + (upsellPrice ?? 0)
        : (+prevPrice + (upsellPrice ?? 0)).toFixed(2);
    const upsellUniquePrice = scProfile?.isRoundPrice
        ? +uniquePrice + (upsellPrice ?? 0)
        : (+uniquePrice + (upsellPrice ?? 0)).toFixed(2)

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
            <div className="text">{text}</div>
            <div className="price">
                {showDetails ?
                    <React.Fragment>
                    <div className="prevPrice">${isUpsellPrice ? upsellPrevPrice : prevPrice}</div>
                    <div className="currentPrice">${isUpsellPrice ? upsellUniquePrice : uniquePrice}</div>
                    </React.Fragment>
                    : <div className="uniquePrice">
                        ${uniquePrice}
                    </div>
                }
            </div>
        </PriceWrapper>
    );
};

export default TotalPriceMobile;