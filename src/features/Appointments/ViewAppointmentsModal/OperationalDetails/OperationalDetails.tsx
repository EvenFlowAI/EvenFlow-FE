import React from "react";
import {IAppointment} from "../../../../api/types";
import {DetailsItem} from "../DetailsItem/DetailsItem";
import {dateTimeFormat} from "../AppointmentDetails/AppointmentDetails";
import {ModifiedData} from "../ModifiedData/ModifiedData";
import moment from "moment";
import {TitleWrapper} from "../styles";

export const OperationalDetails: React.FC<{payload: IAppointment}> = ({payload}) => {
    const createdText = [moment(payload.createdDateTime).utc().format(dateTimeFormat), `Scheduler: ${payload.scheduler?.fullName ?? ''}`]

    return (
        <div>
            <TitleWrapper>Operational Details</TitleWrapper>
            <DetailsItem title="Created" text={createdText} key="date"/>
            <ModifiedData data={payload.modificationInfo}/>
            <DetailsItem title="Service Book" text={payload.serviceBook?.name ?? ''} key="Service"/>
            <DetailsItem title="Appointment Notes" text={payload.notes ?? ''} key="Appointment"/>
        </div>
    );
};