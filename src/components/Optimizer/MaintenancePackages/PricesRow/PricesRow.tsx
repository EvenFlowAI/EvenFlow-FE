import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import TitleEditable from "./TitleEditable";
import PriceItem from "./PriceItem";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";

const useStyles = makeStyles(() => ({
    topLineWrapper: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gridGap: 20,
        padding: '13px 17px 0 17px',
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
                    <PriceItem value={''}/>
                    <PriceItem value={''}/>
                    <PriceItem value={''}/>
                    <PriceItem value={''}/>
                    <PriceItem value={''}/>
                    <PriceItem value={''}/>
                </div>
            </div>
        </div>
    );
};

export default PricesRow;