import React from 'react';
import {ReactComponent as NumberIcon} from "../../../../assets/img/number.svg";
import {ReactComponent as Done} from "../../../../assets/img/checkmark.svg";
import {ReactComponent as Clock} from "../../../../assets/img/clock.svg";
import {ReactComponent as Advisor} from "../../../../assets/img/advisor.svg";
import {ReactComponent as Price} from "../../../../assets/img/price.svg";
import {ReactComponent as Settings} from "../../../../assets/img/settings.svg";
import {ReactComponent as SettingsChecked} from "../../../../assets/img/settings_checkmark.svg";
import {ReactComponent as Transportation} from "../../../../assets/img/transportation.svg";
import {ReactComponent as ConvenienceFees} from "../../../../assets/img/person_dollar.svg";
import {ReactComponent as Address} from "../../../../assets/img/address.svg";
import {makeStyles} from "@material-ui/core/styles";
import {appointmentStatuses, IAppointment} from "../../../../api/types";
import moment from "moment";
import DetailsItem from "./DetailsItem";

const useStyles = makeStyles({
    blockTitle: {
        marginBottom: 24,
        fontSize: 14
    },
})

export const dateTimeFormat = "ddd, MMM DD, YYYY h:mm a"

const AppointmentDetails: React.FC<{payload: IAppointment}> = ({payload}) => {
    const classes = useStyles();
    return (
        <div>
            <div className={classes.blockTitle}>Appointment Details</div>
            <DetailsItem title="Appointment Number" text={payload.appointmentNumber} icon={<NumberIcon/>}/>
            <DetailsItem
                title="Appointment Status"
                text={typeof payload.appointmentStatus !== 'undefined' && Number.isInteger(payload.appointmentStatus)
                    ? appointmentStatuses[payload.appointmentStatus]
                    : ""}
                icon={<Done/>}
            />
            <DetailsItem
                title="Scheduled Appointment"
                text={moment.utc(payload.dateTime).format(dateTimeFormat)}
                icon={<Clock/>}
            />
            <DetailsItem
                title="Services Selected"
                text={payload.servicesRequested}
                icon={<SettingsChecked/>}
            />
            <DetailsItem
                title="Service Option"
                text={payload.serviceOption ?? ''}
                icon={<Settings/>}
            />
            <DetailsItem
                title="Total"
                text={payload.totalValue ? `$${payload.totalValue}` : ''}
                icon={<Price/>}
            />
            <DetailsItem
                title="Convenience Fees"
                text={payload.ancillaryPrice ? `$${payload.ancillaryPrice}` : ''}
                icon={<ConvenienceFees/>}
            />
            <DetailsItem
                title="Advisor"
                text={payload.advisor ?? ''}
                icon={<Advisor/>}
            />
            <DetailsItem
                title="Transportation"
                text={payload.transportation ?? ''}
                icon={<Transportation/>}
            />
            <DetailsItem
                title="Address"
                text={payload.address ? `${payload.address}, ${payload.zipCode}` : ''}
                icon={<Address/>}
            />
        </div>
    );
};

export default AppointmentDetails;