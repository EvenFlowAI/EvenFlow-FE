import React, {useMemo} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import TitleEditable from "./TitleEditable";
import PriceItem from "./PriceItem";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {EMaintenanceOptionType, IPackageById} from "../../../../api/types";
import {updatePriceTitles} from "../../../../store/reducers/packages/actions";
import {EPackagePricingType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {TSummaryCell} from "../PackageAccordion/PackageAccordion";

const useStyles = makeStyles(() => ({
    topLineWrapper: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gridGap: 20,
        padding: '13px 17px 0 17px',
        alignItems: 'baseline'
    },
    wrapper: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gridGap: 20,
        padding: '20px 17px',
    },
    rightPart: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: 20,
    },
    leftPart: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridGap: 20,
    },
    totalInfo: {
        fontSize: 20,
        color: "#202021",
    },
    pricesInfo: {
        fontSize: 16,
        color: "#252733",
    }
}))


const PricesRow: React.FC<{packageData: IPackageById|null, suggestedPrices: TSummaryCell[]}> = ({packageData, suggestedPrices}) => {
    const {currentPackage} = useSelector((state: RootState) => state.packages);
    const classes = useStyles();
    const dispatch = useDispatch();

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

    const onSavePrice = (title: string) => {
        if (currentPackage && title.length) {
            dispatch(updatePriceTitles(currentPackage.id, {title, type: EPackagePricingType.BasePrice}))
        }
    }

    const onSavePriceWithFee = (title: string) => {
        if (currentPackage && title.length) {
            dispatch(updatePriceTitles(currentPackage.id, {title, type: EPackagePricingType.PriceWithFee}))
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
                    <TitleEditable text={basePrice?.title} onSave={onSavePrice}/>
                    <TitleEditable text={withFeePrice?.title} onSave={onSavePriceWithFee}/>
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