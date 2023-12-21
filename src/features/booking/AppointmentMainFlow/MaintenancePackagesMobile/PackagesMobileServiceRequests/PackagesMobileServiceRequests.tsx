import React from 'react';
import {HtmlTooltip} from "../../AppointmentFrame/ServiceCard";
import {TExtendedService} from "../../../../../api/types";
import {usePackageMobileStyles} from "../../../../../commonStyles/usePackageMobileStyles";

type TProps = {
    serviceRequests: TExtendedService[];
    isBmWService: boolean
}

const PackagesMobileServiceRequests: React.FC<TProps> = ({isBmWService, serviceRequests}) => {
    const classes = usePackageMobileStyles();
    return (
        <div className={classes.serviceRequests} style={{paddingBottom: 36}}>
            {serviceRequests
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
                                {item.description}
                            </p>
                        </HtmlTooltip>
                        :  <p className={classes.serviceRequest}
                              key={item.id}
                              style={isBmWService ? {fontSize: 18} : {}}>
                            {item.description}
                        </p>
                })
            }
        </div>
    );
};

export default PackagesMobileServiceRequests;