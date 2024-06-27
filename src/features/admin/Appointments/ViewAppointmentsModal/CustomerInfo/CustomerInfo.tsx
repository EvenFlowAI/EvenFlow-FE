import React from "react";
import {IAppointment} from "../../../../../api/types";
import {TitleWrapper} from "../styles";
import {DetailsItem} from "../DetailsItem/DetailsItem";
import {Divider} from "@mui/material";

export const CustomerInfo:React.FC<React.PropsWithChildren<React.PropsWithChildren<{payload: IAppointment}>>> = ({payload}) => {
    return (
        <div>
            <TitleWrapper>Customer Information</TitleWrapper>
            {payload.customerInformation?.fullName
                ? <div style={{color: "#252733", fontSize: 14,}}>{payload.customerInformation?.fullName}</div>
                : null}
            <DetailsItem
                title={payload.customerInformation?.companyName ?? ''}
                text={`${payload.customerInformation?.email ?? ''} ${payload.customerInformation?.phoneNumber ?? ''}`}/>
            {payload.customerInformation?.dmsId
                ? <div style={{color: "#252733", fontSize: 14,}}>Customer ID: {payload.customerInformation?.dmsId}</div>
                : null}
            <Divider style={{marginBottom: 24}}/>
        </div>
    );
};