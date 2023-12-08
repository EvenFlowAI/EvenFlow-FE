import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import {IAppointment} from "../../../../../api/types";
import DetailsItem from "./DetailsItem";
import {dateTimeFormat} from "./AppointmentDetails";
import Modified from "./Modified";
import moment from "moment";

const useStyles = makeStyles({
    blockTitle: {
        marginBottom: 24,
        fontSize: 14
    },
})

const OperationalDetails: React.FC<{payload: IAppointment}> = ({payload}) => {
    const classes = useStyles();
    const createdText = [moment(payload.createdDateTime).utc().format(dateTimeFormat), `Scheduler: ${payload.scheduler?.fullName ?? ''}`]

    return (
        <div>
            <div className={classes.blockTitle}>Operational Details</div>
            <DetailsItem title="Created" text={createdText} key="date"/>
            <Modified data={payload.modificationInfo}/>
            <DetailsItem title="Service Book" text={payload.serviceBook?.name ?? ''} key="Service"/>
            <DetailsItem title="Appointment Notes" text={payload.notes ?? ''} key="Appointment"/>
        </div>
    );
};

export default OperationalDetails;