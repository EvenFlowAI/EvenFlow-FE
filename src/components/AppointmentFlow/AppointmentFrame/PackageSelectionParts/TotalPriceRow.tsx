import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {TPackage} from "../PackageSelection";
import {IPackageOptions} from "../../../../api/types";
import {makeStyles} from "@material-ui/core/styles";
import {styled, Theme} from "@material-ui/core";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {EPackagePricingType} from "../../../../store/reducers/appointmentFrameReducer/types";

type TTotalPriceRowProps = {
    packages: TPackage[];
    handleClick: (p: IPackageOptions, pricing: EPackagePricingType) => () => void;
    isUpsells?: boolean;
}

const PriceValue = styled('div')<Theme, { selected: boolean, showDetails: boolean }>(({theme, selected, showDetails}) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 4fr',
    justifyContent: 'center',
    alignItems: 'center',
    border: selected ? "1px solid #202021" : '1px solid #BDBDBD',
    background: selected ? "#DADADA" : "#efefef",
    color: "#202021",
    fontWeight: 600,
    fontSize: 16,
    padding: '22px 16px',
    lineHeight: '20px',
    cursor: 'pointer',
    "& .prices": {
        display: 'flex',
        justifyContent: showDetails ? 'space-between' : 'center',
    },
    "& .currentPrice": {
        color: "#D32F2F"
    },
    "& .previousPrice": {
        textDecoration: 'line-through'
    },
}))

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

const useStyles = makeStyles({
    priceText: {
        width: '100%',
        textAlign: 'right',
        fontSize: 16,
        fontWeight: 700,
        color: "#FFFFFF",
        background: "#3E3E40",
        border: '1px solid #DADADA',
        padding: '22px 16px',
        lineHeight: '20px',
    },
    rowWrapper: {
        display: 'grid',

    }
})

const TotalPriceRow: React.FC<TTotalPriceRowProps> = ({packages, handleClick, isUpsells}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {selectedPackage, packagePricingType} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    const classes = useStyles();
    const defaultString = `${t("Total")} (${t("excluding taxes & fees")})`;
    const title = packages[0].priceTitle;

    // todo styles for excluding taxes text above
    return <Wrapper count={packages.length}>
        <div className={classes.priceText}>
            {title && isUpsells ? title : defaultString}:
        </div>
        {packages.map((p) => {
            const complimentaryPrice = p.marketPriceComplimentaryServices ?? 0;
            const servicesPrice = p.price ?? 0;
            const showDetails = Boolean(scProfile?.isShowPriceDetails && complimentaryPrice > 0);
            const selected = p.type === selectedPackage?.type && packagePricingType === EPackagePricingType.BasePrice

            return <PriceValue
                selected={selected}
                onClick={handleClick(p, EPackagePricingType.BasePrice)}
                showDetails={showDetails}
                key={p.id}>
                <div>{selected ? <RadioButtonChecked/> : <RadioButtonUnchecked/>}</div>
                    <div className="prices" style={{ fontSize: 20 }}>
                        {showDetails
                            ? <div className="previousPrice">${scProfile?.isRoundPrice
                                ? complimentaryPrice + servicesPrice
                                : (complimentaryPrice + servicesPrice).toFixed(2)}
                            </div>
                            : null}
                        <div className={showDetails ? "currentPrice" : ""}>
                            ${scProfile?.isRoundPrice
                                ? servicesPrice
                                : (servicesPrice).toFixed(2)}
                        </div>
                    </div>
            </PriceValue>;
        })}
    </Wrapper>
        ;
};

export default TotalPriceRow;