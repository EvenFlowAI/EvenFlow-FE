import React, {useEffect, useState} from 'react';
import {WelcomeLayout} from "./WelcomeLayout";
import {Loading} from "../UI/Loading";
import {useHistory, useParams} from "react-router-dom";
import {API} from "../../api/api";
import {styled} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {loadEditAppointment, loadSCProfile} from "../../store/reducers/appointment/actions";
import {Routes} from "../../config/routes";

const ContentContainer = styled("div")({
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold"
});

type TState = "loading" | "error" | "canceled";

export const EditAppointment = () => {
    const [state, setState] = useState<TState>("loading");

    const history = useHistory();
    const dispatch = useDispatch();
    const {id} = useParams();

    useEffect(() => {
        API.appointment.getByKey(id)
            .then(async ({data}) => {
                await dispatch(loadSCProfile(data.serviceCenterId));
                // TODO: Uncomment
                /*if (data.appointmentStatus === AppointmentStatus.Cancelled) {
                    setState("canceled");
                    return;
                }*/
                await dispatch(loadEditAppointment(data));
                // TODO: Change to replace
                history.push(`${Routes.EndUser.AppointmentBase}/${data.serviceCenterId}`);
            })
            .catch(() => {
                setState("error");
            })
    }, [id, dispatch, history]);

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