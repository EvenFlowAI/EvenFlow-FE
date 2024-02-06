import React from "react";
import {IAppointment} from "../../../../../api/types";
import {DetailsItem} from "../DetailsItem/DetailsItem";
import {dateTimeFormat} from "../AppointmentDetails/AppointmentDetails";
import {ModifiedData} from "../ModifiedData/ModifiedData";
import {TitleWrapper} from "../styles";
import dayjs from "dayjs";

export const OperationalDetails: React.FC<React.PropsWithChildren<React.PropsWithChildren<{payload: IAppointment}>>> = ({payload}) => {
    const date = payload.createdDateTime
        ? payload.createdDateTime.toString().split('.')[0]
        : payload.createdDateTime
    const createdText = [dayjs.utc(date).format(dateTimeFormat), `Scheduler: ${payload.scheduler?.fullName ?? ''}`]

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