import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {TPackage} from "../PackageSelection";
import {IPackageOptions} from "../../../../api/types";
import {makeStyles} from "@material-ui/core/styles";
import {styled, Theme} from "@material-ui/core";
import {EPackagePricingType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";

type TTotalPriceRowProps = {
    packages: TPackage[];
    handleClick: (p: IPackageOptions, pricing: EPackagePricingType) => () => void;
    title: string;
}

const PriceValue = styled('div')<Theme, { selected: boolean, showDetails: boolean, count: number }>(({
                                                                                                         theme,
                                                                                                         selected,
                                                                                                         showDetails,
                                                                                                         count
                                                                                                     }) => ({
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: showDetails ? '1fr 4fr' : '1fr',
    justifyContent: 'center',
    alignItems: 'center',
    border: selected ? "1px solid #202021" : '1px solid #BDBDBD',
    background: selected ? "#FFD966" : "#FFF2CC",
    color: "#202021",
    fontWeight: 600,
    fontSize: 16,
    padding: '22px 16px',
    lineHeight: '20px',
    cursor: "pointer",
    "& .prices": {
        display: 'flex',
        justifyContent: showDetails ? count > 2 ? 'space-between' : 'space-evenly' : 'center',
    },
    "& .currentPrice": {
        color: "#D32F2F"
    },
    "& .previousPrice": {
        textDecoration: 'line-through'
    },
    "& .centeredPrice": {

    },
    "& .positionedBtn": {
        position: 'absolute',
        top: 22,
        left: 16
    }
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
        lineHeight: '20px',
    },
    rowWrapper: {
        display: 'grid',

    }
})

const Wrapper = styled('div')<Theme, { count: number }>(({theme, count}) => ({
    display: "grid",
    gap: "0 16px",
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
    const {selectedPackage, packagePricingType} = useSelector((state: RootState) => state.appointmentFrame);
    const classes = useStyles();


    return <Wrapper count={packages.length}>
        <div className={classes.priceText}>
            {title}:
        </div>
        {packages.map((p) => {
            const complimentaryPrice = p.marketPriceComplimentaryServices ?? 0;
            const servicesPrice = p.price ?? 0;
            const upsellPrice = p.marketPriceIntervalUpsells ?? 0;
            const price = complimentaryPrice + servicesPrice + upsellPrice;
            const showDetails = Boolean(scProfile?.isShowPriceDetails && complimentaryPrice > 0);
            const selected = p.type === selectedPackage?.type && packagePricingType === EPackagePricingType.PriceWithFee

            return <PriceValue
                showDetails={showDetails}
                selected={selected}
                count={packages.length}
                onClick={handleClick(p, EPackagePricingType.PriceWithFee)}
                key={p.id}>
                <div className={showDetails ? "" : "positionedBtn"}>{selected ? <RadioButtonChecked/> : <RadioButtonUnchecked/>}</div>
                <div className="prices" style={{ fontSize: 20 }}>
                    {showDetails
                        ? <div className="previousPrice">${scProfile?.isRoundPrice
                            ? price
                            : price.toFixed(2)}
                        </div>
                        : null}
                    <div className={showDetails ? "currentPrice" : "centeredPrice"}>
                        ${scProfile?.isRoundPrice
                        ? servicesPrice + upsellPrice
                        : (servicesPrice + upsellPrice).toFixed(2)}
                    </div>
                </div>
            </PriceValue>;
        })}
    </Wrapper>
        ;
};

export default TotalPriceWithFeeRow;