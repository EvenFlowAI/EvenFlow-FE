import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";

import {TPackage} from "../../MaintenancePackages/types";
import {usePackageMobileStyles} from "../../../../../hooks/styling/usePackageMobileStyles";

const PackagesMobileTotalComplimentary: React.FC<React.PropsWithChildren<{item: TPackage}>> = ({item}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const classes = usePackageMobileStyles();
    const {t} = useTranslation();
    return scProfile?.isShowPriceDetails
        ? <div className={classes.complimentaryTotal}>
                                <span className={classes.smallText}>
                                    {t("Total Complimentary Value")}:
                                </span>
            <span className={classes.bigText}>
                                        {item.marketPriceComplimentaryServices
                                            ? `$${scProfile?.isRoundPrice
                                                ? item.marketPriceComplimentaryServices
                                                : item.marketPriceComplimentaryServices.toFixed(2)}`
                                            : ''}
                                </span>
        </div>
        : null
};

export default PackagesMobileTotalComplimentary;