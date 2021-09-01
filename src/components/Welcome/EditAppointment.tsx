import React, {useEffect, useState} from 'react';
import {WelcomeLayout} from "./WelcomeLayout";
import {Loading} from "../UI/Loading";
import {useHistory, useParams} from "react-router-dom";
import {API} from "../../api/api";
import {Button, styled} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {
    clearStorage,
    loadEditAppointment,
    loadSCProfile
} from "../../store/reducers/appointment/actions";
import {Routes} from "../../config/routes";
import {AppointmentStatus} from "../../api/types";
import {Edit} from "@material-ui/icons";
import {RootState} from "../../store/rootReducer";
import {NotFoundError} from "./NotFoundError";
import {encodeSCID} from "../../utils/utils";

const ContentContainer = styled("div")({
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold"
});

type TState = "loading" | "error" | "canceled";

export const EditAppointment = () => {
    const [state, setState] = useState<TState>("loading");
    const selectedSC: number|undefined = useSelector((state: RootState) => {
        return state.appointment.scProfile?.id
    });

    const history = useHistory();
    const dispatch = useDispatch();
    const {id} = useParams();

    useEffect(() => {
        API.appointment.getByKey(id)
            .then(async ({data}) => {
                await dispatch(loadSCProfile(data.serviceCenterId));
                if (data.appointmentStatus === AppointmentStatus.Cancelled) {
                    setState("canceled");
                    return;
                }
                await dispatch(loadEditAppointment({...data, hashKey: data.hashKey || id}));
                history.replace(`${Routes.EndUser.AppointmentBase}/${encodeSCID(data.serviceCenterId)}`);
            })
            .catch(() => {
                setState("error");
            })
    }, [id, dispatch, history]);

    const handleCreateNew = () => {
        if (selectedSC) {
            clearStorage();
            history.replace(`${Routes.EndUser.Welcome}/${encodeSCID(selectedSC)}`);
        }
    }

    const getContent = () => {
        switch (state) {
            case "error":
                return <NotFoundError />
            case "canceled":
                return <div>
                    <p>Appointment is already cancelled.</p>
                    <p>
                        <small>If you want to schedule a different one,
                            please click a button below</small>
                    </p> <br/>
                    <Button
                        onClick={handleCreateNew}
                        startIcon={<Edit />}
                        color="primary" variant="contained">
                        Schedule appointment
                    </Button>
                </div>
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