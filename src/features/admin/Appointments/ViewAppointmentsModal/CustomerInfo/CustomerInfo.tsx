import React from "react";
import {IAppointment} from "../../../../../api/types";
import {TitleWrapper} from "../styles";
import {DetailsItem} from "../DetailsItem/DetailsItem";
import {Divider} from "@material-ui/core";

export const CustomerInfo:React.FC<{payload: IAppointment}> = ({payload}) => {
    return (
        <div>
            <TitleWrapper>Customer Information</TitleWrapper>
            <DetailsItem
                title={payload.customerInformation?.fullName ?? ''}
                text={`${payload.customerInformation?.email ?? ''} ${payload.customerInformation?.phoneNumber ?? ''}`}/>
            {payload.customerInformation?.dmsId
                ? <div style={{color: "#252733", fontSize: 14,}}>Customer ID: {payload.customerInformation?.dmsId}</div>
                : null}
            <Divider style={{marginBottom: 24}}/>
        </div>
    );
};