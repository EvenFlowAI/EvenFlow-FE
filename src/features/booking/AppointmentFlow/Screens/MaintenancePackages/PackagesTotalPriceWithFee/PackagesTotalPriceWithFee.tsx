import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {IPackageOptions} from "../../../../../../api/types";
import {EPackagePricingType} from "../../../../../../store/reducers/appointmentFrameReducer/types";
import {RadioButtonChecked, RadioButtonUnchecked} from "@mui/icons-material";
import {TPackage} from "../types";
import {PriceValue, useStyles, Wrapper} from "./styles";

type TTotalPriceRowProps = {
    packages: TPackage[];
    handleClick: (p: IPackageOptions, pricing: EPackagePricingType) => () => void;
    title: string;
    selectedPackage: IPackageOptions|null;
    packagePricingType: EPackagePricingType|null;
}

const PackagesTotalPriceWithFee: React.FC<React.PropsWithChildren<React.PropsWithChildren<TTotalPriceRowProps>>> = ({packages, handleClick, title, selectedPackage, packagePricingType}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const { classes  } = useStyles();


    return <Wrapper count={packages.length}>
        <div className={classes.priceText}>
            {title}:
        </div>
        {packages.map((p) => {
            const complimentaryPrice = p.marketPriceComplimentaryServices ?? 0;
            const servicesPrice = p.price ?? 0;
            const totalMaintenance = p.totalMaintenanceValue ?? 0;
            const upsellPrice = p.marketPriceIntervalUpsells ?? 0;
            // todo change totalMaintenance to servicePrice
           // const price = complimentaryPrice + servicesPrice + upsellPrice;
            const price = complimentaryPrice + totalMaintenance + upsellPrice;
            const showDetails = Boolean(scProfile?.isShowPriceDetails && complimentaryPrice > 0);
            const selected = p.type === selectedPackage?.type && packagePricingType === EPackagePricingType.PriceWithFee

            return <PriceValue
                showDetails={showDetails}
                roundPrice={scProfile?.isRoundPrice}
                selected={selected}
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

export default PackagesTotalPriceWithFee;