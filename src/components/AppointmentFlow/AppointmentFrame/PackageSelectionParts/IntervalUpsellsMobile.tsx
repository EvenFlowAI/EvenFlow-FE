import React from 'react';
import {HtmlTooltip} from "../ServiceCard";
import {usePackageMobileStyles} from "../PackageSelectionMobile";
import {useTranslation} from "react-i18next";
import {TUpsellOfOption} from "../../../../api/types";

type TProps = {
    intervalUpsells: TUpsellOfOption[];
    isBmWService: boolean
}

const IntervalUpsellsMobile: React.FC<TProps> = ({intervalUpsells, isBmWService}) => {
    const classes = usePackageMobileStyles();
    const {t} = useTranslation();

    return intervalUpsells?.length
            ? <React.Fragment>
                <div className={classes.upsellTitle} style={isBmWService ? {fontSize: 16} : {}}>
                    {t(t("Service Interval Upsell"))}
                </div>
                <div className={classes.intervalUpsells}>
                    {intervalUpsells
                        .slice()
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .map(item => {
                            return item.detailedDescription?.length
                                ? <HtmlTooltip
                                    key={item.id}
                                    placement="top"
                                    enterTouchDelay={0}
                                    title={<div dangerouslySetInnerHTML={{__html: item.detailedDescription}}/>}
                                >
                                    <p className={classes.serviceRequestUnderlined}
                                       style={isBmWService ? {fontSize: 18} : {}}>
                                        {item.name}
                                    </p>
                                </HtmlTooltip>
                                :  <p className={classes.serviceRequest}
                                      key={item.id}
                                      style={isBmWService ? {fontSize: 18} : {}}>
                                    {item.name}
                                </p>
                        })
                    }
                </div>
            </React.Fragment>
            : null
};

export default IntervalUpsellsMobile;