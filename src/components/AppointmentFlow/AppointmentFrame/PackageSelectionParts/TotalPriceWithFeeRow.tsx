import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {TPackage} from "../PackageSelection";
import {IPackageOptions} from "../../../../api/types";
import {makeStyles} from "@material-ui/core/styles";
import {styled, Theme} from "@material-ui/core";

type TTotalPriceRowProps = {
    packages: TPackage[];
    handleClick: (p: IPackageOptions) => () => void;
    title?: string;
}

const PriceValue = styled('div')<Theme, { selected: boolean }>(({theme, selected}) => ({
    border: selected ? "1px solid #202021" : '1px solid #BDBDBD',
    background: selected ? "#FFD966" : "#FFF2CC",
    color: "#202021",
    fontWeight: 600,
    fontSize: 16,
    padding: '22px 16px',
}))

const useStyles = makeStyles({
    priceText: {
        width: '100%',
        textAlign: 'right',
        fontSize: 16,
        fontWeight: 700,
        color: "#FFFFFF",
        background: "#FFD966",
        border: '1px solid #DADADA',
        padding: '22px 16px',
    },
    rowWrapper: {
        display: 'grid',

    }
})

const Wrapper = styled('div')<Theme, { count: number }>(({theme, count}) => ({
    display: "grid",
    marginTop: 12,
    gap: "0 20px",
    gridTemplateColumns: count === 3
        ? `2fr repeat(${count}, 1fr)`
        : count === 2
            ? '1fr 1fr 1fr'
            : '1fr 1fr',
    width: "100%",
    alignItems: "stretch",
    [theme.breakpoints.down('sm')]: {
        overflowX: "auto"
    },
}))

const TotalPriceWithFeeRow: React.FC<TTotalPriceRowProps> = ({packages, handleClick, title}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const classes = useStyles();

    // todo logic for selected price
    const selected = 1;

    return <Wrapper count={packages.length}>
        <div className={classes.priceText}>
            {title}:
        </div>
        {packages.map((p, i) => {
            const complimentaryPrice = p.marketPriceComplimentaryServices ?? 0;
            const servicesPrice = p.price ?? 0;
            const upsellPrice = p.marketPriceIntervalUpsells ?? 0;
            const price = complimentaryPrice + servicesPrice + upsellPrice
            return <PriceValue
                selected={i === selected}
                onClick={handleClick(p)}
                key={p.id}>
                    <span style={{ fontSize: 20 }}>
                       {scProfile?.isRoundPrice ? price : price.toFixed(2)}
                    </span>
            </PriceValue>;
        })}
    </Wrapper>
        ;
};

export default TotalPriceWithFeeRow;