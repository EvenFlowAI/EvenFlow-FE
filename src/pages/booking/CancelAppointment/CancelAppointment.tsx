import React, {useEffect, useState} from 'react';
import {WelcomeLayout} from "../../../features/booking/WelcomeLayout/WelcomeLayout";
import {useHistory, useParams} from "react-router-dom";
import {API} from "../../../api/api";
import {AppointmentStatus, IAppointmentByQuery} from "../../../api/types";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {useDispatch} from "react-redux";
import {clearStorage, loadSCProfile} from "../../../store/reducers/appointment/actions";
import {Button, styled} from "@mui/material";
import {Edit} from "@mui/icons-material";
import {NotFoundError} from "../../../components/wrappers/NotFoundError/NotFoundError";
import {encodeSCID} from "../../../utils/utils";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "../../../components/buttons/LoadingButton/LoadingButton";
import {useStorage} from "../../../hooks/useStorage/useStorage";
import {useException} from "../../../hooks/useException/useException";
import {Routes} from "../../../routes/constants";
import dayjs from "dayjs";

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
    const {id} = useParams<{id: string}>();
    const dispatch = useDispatch();
    const showError = useException();
    const history = useHistory();
    const {t} = useTranslation();

    useStorage();

    useEffect(() => {
        setLoading(true);
        if (id) {
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
        }
    }, [id]);

    useEffect(() => {
        if (appointment?.serviceCenterId) {
            dispatch(loadSCProfile(appointment.serviceCenterId));
        }
    }, [appointment, dispatch]);

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
            return dayjs.utc(`${String(dateInUtc).split("T")[0]}T${timeSlot}Z`)
        } else {
            return dayjs.utc();
        }
    }

    const getData = (): JSX.Element|null => {
        switch (tState) {
            case "already_canceled":
                return <p>{t("appointment canceled")}.</p>;
            case "canceled":
                return <div>
                    <p>{t("You've successfully canceled your appointment")}.</p>
                    <p><small><em>{t("Please do not forget to update the appointment in your calendar")}.</em></small></p>
                    <p>
                        <small>{t("Schedule different appointment")}</small>
                    </p> <br/>
                    <Button
                        onClick={handleCreateNew}
                        startIcon={<Edit />}
                        color="primary" variant="contained">
                        {t("Schedule appointment")}
                    </Button>
                </div>;
            case "error":
                return <NotFoundError />
            case "new":
                return <div>
                    <p>{t("Please confirm you want to cancel your appointment for")} {getDate().format("dddd, MMM D, h:mm a")}?</p>
                    <LoadingButton
                        onClick={handleCancel}
                        loading={saving}
                        fullWidth
                        variant="contained"
                        color="secondary">
                        {t("Cancel Appointment")}
                    </LoadingButton>
                    <Info>{t("If you've changed your mind - you can close this window")}.</Info>
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