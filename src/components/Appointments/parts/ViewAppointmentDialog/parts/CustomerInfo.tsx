import React from "react";
import {IAppointment} from "../../../../../api/types";
import DetailsItem from "./DetailsItem";
import {Divider} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    blockTitle: {
        marginBottom: 24,
        fontSize: 14
    },
})

export const CustomerInfo:React.FC<{payload: IAppointment}> = ({payload}) => {
    const classes = useStyles();
    return (
        <div>
            <div className={classes.blockTitle}>Customer Information</div>
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