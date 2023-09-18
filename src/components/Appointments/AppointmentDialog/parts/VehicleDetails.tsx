import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {IAppointment} from "../../../../api/types";
import DetailsItem from "./DetailsItem";
import {Divider} from "@material-ui/core";

const useStyles = makeStyles({
    blockTitle: {
        marginBottom: 24,
        fontSize: 14
    },
})

export const VehicleDetails:React.FC<{payload: IAppointment}> = ({payload}) => {
    const classes = useStyles();
    return (
        <div>
            <div className={classes.blockTitle}>Vehicle Details</div>
            <DetailsItem
                title={payload.vehicle?.vin ?? ''}
                text={`${payload.vehicle?.make ?? ''} ${payload.vehicle?.model ?? ''} ${payload.vehicle?.year ?? ''}`}/>
            <Divider style={{marginBottom: 24}}/>
        </div>
    );
};

export const CustomerInfo:React.FC<{payload: IAppointment}> = ({payload}) => {
    const classes = useStyles();
    return (
        <div>
            <div className={classes.blockTitle}>Customer Information</div>
            <DetailsItem
                title={payload.customerInformation?.fullName ?? ''}
                text={`${payload.customerInformation?.email ?? ''} ${payload.customerInformation?.phoneNumber ?? ''}`}/>
            <Divider style={{marginBottom: 24}}/>
        </div>
    );
};