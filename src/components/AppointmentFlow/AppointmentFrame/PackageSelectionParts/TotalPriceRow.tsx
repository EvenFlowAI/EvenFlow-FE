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
    title: string;
}

const PriceValue = styled('div')<Theme, { selected: boolean, showDetails: boolean, count: number, roundPrice?: boolean }>(({
                                                                                                         theme,
                                                                                                         selected,
                                                                                                         showDetails,
                                                                                                         count,
                                                                                                                               roundPrice
}) => ({
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: showDetails ? '1fr 4fr' : '1fr',
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
    [`${theme.breakpoints.down("md")} and (orientation: landscape)`]: {
        gridTemplateColumns: showDetails ? '1fr 2fr' : '1fr',
        padding: '11px 8px',
    },
    [`${theme.breakpoints.down("sm")} and (orientation: landscape)`]: {
        gridTemplateColumns: showDetails ? '1fr 3fr' : '1fr',
        padding: '8px 6px',
    },
    "& .prices": {
        display: 'flex',
        justifyContent: showDetails ? !roundPrice ? 'space-between' : 'space-evenly' : 'center',
        [`${theme.breakpoints.down("md")} and (orientation: landscape)`]: {
            flexDirection: 'column'
        }
    },
    "& .currentPrice": {
        color: "#D32F2F"
    },
    "& .previousPrice": {
        textDecoration: 'line-through',
    },
    "& .centeredPrice": {
        paddingLeft: 36
    },
    "& .positionedBtn": {
        position: 'absolute',
        top: 19,
        left: 16
    }
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

const TotalPriceRow: React.FC<TTotalPriceRowProps> = ({packages, handleClick, isUpsells, title}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {selectedPackage, packagePricingType} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    const classes = useStyles();
    const defaultString = `${t("Total")} (${t("excluding taxes & fees")})`;

    return <Wrapper count={packages.length}>
        <div className={classes.priceText}>
            {title?.length && isUpsells ? title : defaultString}:
        </div>
        {packages.map((p) => {
            const complimentaryPrice = p.marketPriceComplimentaryServices ?? 0;
            const servicesPrice = p.price ?? 0;
            const showDetails = Boolean(scProfile?.isShowPriceDetails && complimentaryPrice > 0);
            const selected = p.type === selectedPackage?.type && packagePricingType === EPackagePricingType.BasePrice
            // todo change totalMaintenance to servicePrice
            return <PriceValue
                selected={selected}
                count={packages.length}
                roundPrice={scProfile?.isRoundPrice}
                onClick={handleClick(p, EPackagePricingType.BasePrice)}
                showDetails={showDetails}
                key={p.id}>
                <div className={showDetails ? "" : "positionedBtn"}>{selected ? <RadioButtonChecked/> : <RadioButtonUnchecked/>}</div>
                <div className="prices" style={{ fontSize: 20 }}>
                    {showDetails
                        ? <div className="previousPrice">${scProfile?.isRoundPrice
                            ? complimentaryPrice + +p.totalMaintenanceValue
                            : (complimentaryPrice + +p.totalMaintenanceValue).toFixed(2)}
                        </div>
                        : null}
                    <div className={showDetails ? "currentPrice" : "centeredPrice"}>
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