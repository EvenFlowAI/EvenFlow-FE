import React from 'react';
import {IAppointment} from "../../../../api/types";
import {DetailsItem} from "../DetailsItem/DetailsItem";
import {Divider} from "@material-ui/core";
import {TitleWrapper} from "../styles";

export const VehicleDetails:React.FC<{payload: IAppointment}> = ({payload}) => {
    return (
        <div>
            <TitleWrapper>Vehicle Details</TitleWrapper>
            <DetailsItem
                title={payload.vehicle?.vin ?? ''}
                text={`${payload.vehicle?.make ?? ''} ${payload.vehicle?.model ?? ''} ${payload.vehicle?.year ?? ''}`}/>
            {payload.vehicle?.dmsId
                ? <div style={{color: "#252733", fontSize: 14,}}>Vehicle ID: {payload.vehicle?.dmsId}</div>
                : null}
            <Divider style={{marginBottom: 24}}/>
        </div>
    );
};

