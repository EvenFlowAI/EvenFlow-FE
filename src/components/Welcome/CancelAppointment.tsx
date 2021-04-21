import React, {useEffect, useState} from 'react';
import {WelcomeLayout} from "./WelcomeLayout";
import {useParams} from "react-router-dom";
import {API} from "../../api/api";
import {ICreateAppointmentResp} from "../../api/types";

export const CancelAppointment = () => {
    const [appointment, setAppointment] = useState<ICreateAppointmentResp|null>(null);
    const {id} = useParams();

    useEffect(() => {
        API.appointment.getByKey(id)
            .then(({data}) => {setAppointment(data)})
            .catch(() => {

            })
    }, [id]);

    const handleCancel = () => {

    }

    return <WelcomeLayout title="You want to cancel appointment?">
        Content
    </WelcomeLayout>
};