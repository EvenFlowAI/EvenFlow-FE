import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import {IAppointment} from "../../../../api/types";
import DetailsItem from "./DetailsItem";
import moment from "moment/moment";
import {dateTimeFormat} from "./AppointmentDetails";

const useStyles = makeStyles({
    blockTitle: {
        marginBottom: 24,
        fontSize: 14
    },
})

const OperationalDetails: React.FC<{payload: IAppointment}> = ({payload}) => {
    const classes = useStyles();
    return (
        <div>
            <div className={classes.blockTitle}>Operational Details</div>
            <DetailsItem title="Created Date" text={moment(payload.createdDateTime).format(dateTimeFormat)} />
            <DetailsItem title="Scheduler" text={payload.scheduler.fullName ?? ''} />
            <DetailsItem title="Service Book details" text={payload.serviceBook?.name ?? ''} />
            <DetailsItem title="Appointment Notes" text={payload.appointmentNotes ?? ''} />
        </div>
    );
};

export default OperationalDetails;