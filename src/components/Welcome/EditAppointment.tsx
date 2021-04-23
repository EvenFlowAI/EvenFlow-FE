import React, {useEffect, useState} from 'react';
import {WelcomeLayout} from "./WelcomeLayout";
import {Loading} from "../UI/Loading";
import {useParams} from "react-router-dom";
import {API} from "../../api/api";
import {AppointmentStatus, IListAppointment} from "../../api/types";
import {styled} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {loadSCProfile} from "../../store/reducers/appointment/actions";

const ContentContainer = styled("div")({
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold"
});

type TState = "loading" | "error" | "canceled";

export const EditAppointment = () => {
    const [state, setState] = useState<TState>("loading");
    const [appointment, setAppointment] = useState<IListAppointment|null>(null);
    const dispatch = useDispatch();
    const {id} = useParams();

    useEffect(() => {
        API.appointment.getByKey(id)
            .then(({data}) => {
                dispatch(loadSCProfile(data.serviceCenterId));
                setAppointment(data);
                if (data.appointmentStatus === AppointmentStatus.Cancelled) {
                    setState("canceled")
                }
            })
            .catch(() => {
                setState("error");
            })
    }, [id, dispatch]);

    const getContent = () => {
        switch (state) {
            case "error":
                return <p>Error</p>
            case "canceled":
                return <p>Appointment is canceled, it can't be updated</p>
            case "loading":
            default:
                return <Loading />
        }
    }

    return <WelcomeLayout title={""}>
        <ContentContainer>
            {getContent()}
        </ContentContainer>
    </WelcomeLayout>
};