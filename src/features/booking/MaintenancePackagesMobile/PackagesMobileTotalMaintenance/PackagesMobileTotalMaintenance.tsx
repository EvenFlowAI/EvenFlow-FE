import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";

import {TPackage} from "../../MaintenancePackages/types";
import {usePackageMobileStyles} from "../../../../hooks/styling/usePackageMobileStyles";

const PackagesMobileTotalMaintenance: React.FC<React.PropsWithChildren<React.PropsWithChildren<{ item: TPackage }>>> = ({item}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const { classes  } = usePackageMobileStyles();
    const {t} = useTranslation();

    return scProfile?.isShowPriceDetails
        ? <div className={classes.totalMaintenance}>
                                <span className={classes.smallText}>
                                  {t("Total Maintenance Value")}:
                                </span>
            <span className={classes.bigText}>
                ${scProfile?.isRoundPrice ? item.totalMaintenanceValue : item.totalMaintenanceValue.toFixed(2)}
            </span>
        </div>
        : null
};

export default PackagesMobileTotalMaintenance;