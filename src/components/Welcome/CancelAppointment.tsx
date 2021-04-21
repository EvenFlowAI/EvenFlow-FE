import React, {useEffect, useMemo, useState} from 'react';
import {WelcomeLayout} from "./WelcomeLayout";
import {useParams} from "react-router-dom";
import {API} from "../../api/api";
import {AppointmentStatus, IListAppointment} from "../../api/types";
import {useException} from "../../utils/hooks";
import {LoadingButton} from "../UI/Button";
import {Loading} from "../UI/Loading";

type TState = "loading" | "new" | "canceled" | "already_canceled"

export const CancelAppointment = () => {
    const [appointment, setAppointment] = useState<IListAppointment|null>(null);
    const [tState, setTState] = useState<TState>("loading");
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const {id} = useParams();
    const showError = useException();

    const decodedId: string = useMemo(() => {
        return decodeURIComponent(id);
    }, [id]);

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

            })
            .finally(() => { setLoading(false); })
    }, [id]);

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

    const getTitle = (): string => {
        switch (tState) {
            case "canceled":
                return "Your appointment was successfully canceled"
            case "already_canceled":
                return "You've already canceled your appointment"
            case "new":
                return "Do you want to cancel appointment?"
            default:
                return ""
        }
    }

    const getData = (): JSX.Element|null => {
        switch (tState) {
            case "already_canceled":
                return null;
            case "canceled":
                return null;
            case "new":
                return <LoadingButton
                    onClick={handleCancel}
                    loading={saving}
                    fullWidth
                    variant="contained"
                    color="secondary">
                    Cancel Appointment
                </LoadingButton>;
            default:
                if (loading) {
                    return <Loading />
                }
                return null;
        }
    }

    return <WelcomeLayout title={getTitle()}>
        {getData()}
    </WelcomeLayout>
};