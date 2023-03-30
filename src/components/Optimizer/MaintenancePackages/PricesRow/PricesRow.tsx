import React, {useMemo} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import TitleEditable from "./TitleEditable";
import PriceItem from "./PriceItem";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {EMaintenanceOptionType} from "../../../../api/types";

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


const PricesRow = () => {
    const {currentPackage} = useSelector((state: RootState) => state.packages);
    const classes = useStyles();
    const [goodOption, betterOption, bestOption] = useMemo(() => {
        const optOne = currentPackage?.options?.find(el => el.type === EMaintenanceOptionType.Base)
        const optTwo = currentPackage?.options?.find(el => el.type === EMaintenanceOptionType.Value)
        const optThree = currentPackage?.options?.find(el => el.type === EMaintenanceOptionType.Preferred)
        return [optOne, optTwo, optThree]
    }, [currentPackage])

    const goodCorePrice = useMemo(() => {
        let price = 0;
        if (goodOption) price = goodOption.serviceRequestPrice + goodOption.complimentaryServicePrice;
        return price;
    }, [goodOption])

    const betterCorePrice = useMemo(() => {
        let price = 0;
        if (betterOption) price = betterOption.serviceRequestPrice + betterOption.complimentaryServicePrice;
        return price;
    }, [betterOption])

    const bestCorePrice = useMemo(() => {
        let price = 0;
        if (bestOption) price = bestOption.serviceRequestPrice + bestOption.complimentaryServicePrice;
        return price;
    }, [bestOption])

    const goodUpsellPrice = useMemo(() => {
        let price = goodCorePrice;
        if (goodOption && goodOption.intervalUpsellPrice) price = goodCorePrice + +goodOption.intervalUpsellPrice;
        return price;
    }, [goodOption, goodCorePrice])

    const betterUpsellPrice = useMemo(() => {
        let price = betterCorePrice;
        if (betterOption && betterOption.intervalUpsellPrice) price = betterCorePrice + +betterOption.intervalUpsellPrice;
        return price;
    }, [betterOption, betterCorePrice])

    const bestUpsellPrice = useMemo(() => {
        let price = bestCorePrice;
        if (bestOption && bestOption.complimentaryServicePrice) price = bestOption.serviceRequestPrice + +bestOption.complimentaryServicePrice;
        return price;
    }, [bestOption, bestCorePrice])

    const onSave = (name: string, id: number) => {
        // todo set data of Package
    }

    // todo text value, price value

    return (
        <div>
            <div className={classes.topLineWrapper}>
                <p className={classes.totalInfo}>Total (Excluding taxes & fees): </p>
                <p className={classes.pricesInfo}>Those values is automatic counted</p>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.rightPart}>
                    <TitleEditable text={''} onSave={onSave} id={1}/>
                    <TitleEditable text={''} onSave={onSave} id={2}/>
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