import React from "react";
import {IAppointment} from "../../../../../api/types";
import {TitleWrapper} from "../styles";
import {DetailsItem} from "../DetailsItem/DetailsItem";
import {Divider} from "@mui/material";

export const CustomerInfo:React.FC<React.PropsWithChildren<React.PropsWithChildren<{payload: IAppointment}>>> = ({payload}) => {
    return (
        <div>
            <TitleWrapper>Customer Information</TitleWrapper>
            <DetailsItem
                title={payload.customerInformation?.fullName ?? ''}
                text={`${payload.customerInformation?.email ?? ''} ${payload.customerInformation?.phoneNumber ?? ''}`}/>
            {payload.customerInformation?.dmsId
                ? <div style={{color: "#252733", fontSize: 14,}}>Customer ID: {payload.customerInformation?.dmsId}</div>
                : null}
            {payload.customerInformation?.companyName
                ? <div style={{color: "#252733", fontSize: 14, marginTop: 12}}>Company Name:
                    <span style={{color: "#858585", fontSize: 14}}> {payload.customerInformation?.companyName}</span>
            </div>
            : null }
            <Divider style={{marginBottom: 24}}/>
        </div>
    );
};