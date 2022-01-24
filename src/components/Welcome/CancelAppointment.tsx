import React, {useEffect, useState} from 'react';
import {WelcomeLayout} from "./WelcomeLayout";
import {useHistory, useParams} from "react-router-dom";
import {API} from "../../api/api";
import {AppointmentStatus, IAppointmentByQuery} from "../../api/types";
import {useException} from "../../utils/hooks";
import {LoadingButton} from "../UI/Button";
import {Loading} from "../UI/Loading";
import {useDispatch} from "react-redux";
import {clearStorage, loadSCProfile} from "../../store/reducers/appointment/actions";
import {Button, styled} from "@material-ui/core";
import moment from "moment";
import {Edit} from "@material-ui/icons";
import {Routes} from "../../config/routes";
import {NotFoundError} from "./NotFoundError";
import {encodeSCID} from "../../utils/utils";
import {v4 as uuidv4} from "uuid";
import {LocalTokens} from "../../types/types";

type TState = "loading" | "new" | "canceled" | "already_canceled" | "error";

const ContentContainer = styled("div")({
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold"
});

const Info = styled("p")({
    fontSize: 12,
    fontWeight: "normal"
})

export const CancelAppointment = () => {
    const [appointment, setAppointment] = useState<IAppointmentByQuery|null>(null);
    const [tState, setTState] = useState<TState>("loading");
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const {id} = useParams();
    const dispatch = useDispatch();
    const showError = useException();
    const history = useHistory();

    useEffect(() => {
        setLoading(true);
        API.appointment.getByKey(id)
            .then(({data}) => {
                setAppointment(data);
                if (data.appointmentStatus === AppointmentStatus.Cancelled) {
                    setTState("already_canceled");
                } else {
                    setTState("new");
                }
            })
            .catch(() => {
                setTState("error");
            })
            .finally(() => { setLoading(false); })
    }, [id]);

    useEffect(() => {
        if (appointment?.serviceCenterId) {
            dispatch(loadSCProfile(appointment.serviceCenterId));
        }
        if (!sessionStorage.getItem(LocalTokens.sessionId)) {
            const uid = uuidv4();
            sessionStorage.setItem(LocalTokens.sessionId, uid);
        }
        window.addEventListener('unload', () => {
            sessionStorage.setItem(LocalTokens.sessionId, '')
        })
    }, [appointment, dispatch, sessionStorage]);



    const handleCancel = async () => {
        setSaving(true);
        try {
            await API.appointment.cancelByKey(id);
            setTState("canceled");
        } catch (e) {
            showError(e);
        } finally {
            setSaving(false);
        }
    }

    const handleCreateNew = () => {
        if (appointment?.serviceCenterId) {
            clearStorage();
            history.replace(`${Routes.EndUser.Welcome}/${encodeSCID(appointment.serviceCenterId)}?frame=1`);
        }
    }

    const getDate = () => {
        if (appointment) {
            const {dateInUtc, timeSlot} = appointment;
            return moment.utc(`${String(dateInUtc).split("T")[0]}T${timeSlot}Z`)
        } else {
            return moment();
        }
    }

    const getData = (): JSX.Element|null => {
        switch (tState) {
            case "already_canceled":
                return <p>Your appointment is already canceled.</p>;
            case "canceled":
                return <div>
                    <p>You've successfully canceled your appointment.</p>
                    <p><small><em>Please do not forget to update the appointment in your calendar.</em></small></p>
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
                </div>;
            case "error":
                return <NotFoundError />
            case "new":
                return <div>
                    <p>Are you sure want to cancel your appointment for {getDate().format("dddd, MMM Do, h:mm a")}?</p>
                    <LoadingButton
                        onClick={handleCancel}
                        loading={saving}
                        fullWidth
                        variant="contained"
                        color="secondary">
                        Cancel Appointment
                    </LoadingButton>
                    <Info>If you've changed your mind - you can close this window.</Info>
                </div>;
            default:
                if (loading) {
                    return <Loading />
                }
                return null;
        }
    }

    return <WelcomeLayout title={""}>
        <ContentContainer>
            {getData()}
        </ContentContainer>
    </WelcomeLayout>
};