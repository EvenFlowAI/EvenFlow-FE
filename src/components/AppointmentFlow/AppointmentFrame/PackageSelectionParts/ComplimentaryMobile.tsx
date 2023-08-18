import React from 'react';
import {HtmlTooltip} from "../ServiceCard";
import {usePackageMobileStyles} from "../PackageSelectionMobile";
import {useTranslation} from "react-i18next";
import {TExtendedComplimentary} from "../../../../api/types";

type TProps = {
    isBmWService: boolean;
    complimentaryServices: TExtendedComplimentary[];
}

const ComplimentaryMobile: React.FC<TProps> = ({isBmWService, complimentaryServices}) => {
    const classes = usePackageMobileStyles();
    const {t} = useTranslation();

    return (
        <React.Fragment>
            <div className={classes.complimentaryTitle} style={isBmWService ? {fontSize: 16} : {}}>
                {t("Complimentary")}
            </div>

            <div className={classes.complimentaryServices}>
                {complimentaryServices
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
                                   style={isBmWService ? {fontSize: 18} : {}}>{item.name}</p>
                            </HtmlTooltip>
                            : <p className={classes.serviceRequest}
                                 key={item.id}
                                 style={isBmWService ? {fontSize: 18} : {}}>{item.name}</p>
                    })}
            </div>
        </React.Fragment>
    );
};

export default ComplimentaryMobile;