import React, {Dispatch, SetStateAction, useMemo} from 'react';
import PriceTitleEditable from "./PriceTitleEditable/PriceTitleEditable";
import PriceItem from "./PricesItem/PriceItem";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {EMaintenanceOptionType, IPackageById} from "../../../../../api/types";
import {updatePriceTitles} from "../../../../../store/reducers/packages/actions";
import {EPackagePricingType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {TSummaryCell} from "../../types";
import {useStyles} from "./styles";

import {useMessage} from "../../../../../hooks/useMessage/useMessage";

type TProps = {
    packageData: IPackageById|null;
    setPackageData: Dispatch<SetStateAction<IPackageById|null>>;
    suggestedPrices: TSummaryCell[];
}

const PricesRow: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({packageData, suggestedPrices, setPackageData}) => {
    const {currentPackage} = useSelector((state: RootState) => state.packages);
    const { classes  } = useStyles();
    const dispatch = useDispatch();
    const showMessage = useMessage();

    const basePrice = useMemo(() => currentPackage?.priceTitles?.find(item => item.type === EPackagePricingType.BasePrice),
        [currentPackage])
    const withFeePrice = useMemo(() => currentPackage?.priceTitles?.find(item => item.type === EPackagePricingType.PriceWithFee),
        [currentPackage])

    const [goodOption, betterOption, bestOption] = useMemo(() => {
        const optOne = packageData?.options?.find(el => el.type === EMaintenanceOptionType.Base)
        const optTwo = packageData?.options?.find(el => el.type === EMaintenanceOptionType.Value)
        const optThree = packageData?.options?.find(el => el.type === EMaintenanceOptionType.Preferred)
        return [optOne, optTwo, optThree]
    }, [packageData])

    const goodCorePrice = useMemo(() => {
        let price = 0;
        if (goodOption) {
            if (currentPackage?.isShowSuggestedPrice) {
                const suggested = suggestedPrices.find(el => el.optionType === goodOption.type)?.numberValue;
                if (suggested) price = +suggested;
            } else {
                price = +goodOption.serviceRequestPrice;
            }
        }
        return price;
    }, [goodOption, currentPackage, suggestedPrices])

    const betterCorePrice = useMemo(() => {
        let price = 0;
        if (betterOption) {
            if (currentPackage?.isShowSuggestedPrice) {
                const suggested = suggestedPrices.find(el => el.optionType === betterOption.type)?.numberValue;
                if (suggested) price = +suggested;
            } else {
                price = +betterOption.serviceRequestPrice;
            }
        }
        return price;
    }, [betterOption, currentPackage, suggestedPrices])

    const bestCorePrice = useMemo(() => {
        let price = 0;
        if (bestOption) {
            if (currentPackage?.isShowSuggestedPrice) {
                const suggested = suggestedPrices.find(el => el.optionType === bestOption.type)?.numberValue;
                if (suggested) price = +suggested;
            } else {
                price = +bestOption.serviceRequestPrice;
            }
        }
        return price;
    }, [bestOption, currentPackage, suggestedPrices])

    const goodUpsellPrice = useMemo(() => {
        let price = goodCorePrice;
        if (goodOption && goodOption.intervalUpsellServicePrice) price = +goodCorePrice + +goodOption.intervalUpsellServicePrice;
        return price;
    }, [goodOption, goodCorePrice])

    const betterUpsellPrice = useMemo(() => {
        let price = betterCorePrice;
        if (betterOption && betterOption.intervalUpsellServicePrice) price = +betterCorePrice + +betterOption.intervalUpsellServicePrice;
        return price;
    }, [betterOption, betterCorePrice])

    const bestUpsellPrice = useMemo(() => {
        let price = bestCorePrice;
        if (bestOption && bestOption.intervalUpsellServicePrice) price = +bestCorePrice + +bestOption.intervalUpsellServicePrice;
        return price;
    }, [bestOption, bestCorePrice])

    const onPriceUpdated = (title: string, type: EPackagePricingType) => {
        showMessage("Package Price Title Updated")
        setPackageData(prev => {
            if (prev) {
                const priceTitles = prev.priceTitles.filter(el => el.type !== type)
                priceTitles.push({title, type})
                return {...prev, priceTitles}
            }
            return prev;
        })
    }

    const onSavePrice = (title: string) => {
        if (currentPackage && title.length) {
            const type: EPackagePricingType = EPackagePricingType.BasePrice;
            dispatch(updatePriceTitles(currentPackage.id, {title, type}, () => onPriceUpdated(title, type)))
        }
    }

    const onSavePriceWithFee = (title: string) => {
        if (currentPackage && title.length) {
            const type: EPackagePricingType = EPackagePricingType.PriceWithFee;
            dispatch(updatePriceTitles(currentPackage.id, {title, type}, () => onPriceUpdated(title, type)))
        }
    }

    return (
        <div>
            <div className={classes.topLineWrapper}>
                <p className={classes.totalInfo}>Total (Excluding taxes & fees): </p>
                <p className={classes.pricesInfo}>Those values is automatic counted</p>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.rightPart}>
                    <PriceTitleEditable text={basePrice?.title} onSave={onSavePrice}/>
                    <PriceTitleEditable text={withFeePrice?.title} onSave={onSavePriceWithFee}/>
                </div>
                <div className={classes.leftPart}>
                    <PriceItem value={goodCorePrice}/>
                    <PriceItem value={betterCorePrice}/>
                    <PriceItem value={bestCorePrice}/>
                    <PriceItem value={goodUpsellPrice}/>
                    <PriceItem value={betterUpsellPrice}/>
                    <PriceItem value={bestUpsellPrice}/>
                </div>
            </div>
        </div>
    );
};

export default PricesRow;