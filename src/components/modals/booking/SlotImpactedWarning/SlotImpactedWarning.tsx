import React, {useEffect, useState} from 'react';
import {BaseModal, DialogTitle} from "../../BaseModal/BaseModal";
import {useTranslation} from "react-i18next";
import {setSlotsWarningOpen} from "../../../../store/reducers/modals/actions";
import {setCurrentFrameScreen} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useHistory, useParams} from "react-router-dom";
import {useStyles} from "./styles";
import {LoadingButton} from "../../../buttons/LoadingButton/LoadingButton";
import {TScreen} from "../../../../types/types";

const SlotImpactedWarning = () => {
    const {isSlotsWarningOpen} = useSelector((state: RootState) => state.modals);
    const {isAppointmentTimingAvailable, isTransportationAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const {currentScreen} = useSelector((state: RootState) => state.appointmentFrame);
    const [screen, setScreen] = useState<TScreen|"">("")
    const dispatch = useDispatch();
    const { classes  } = useStyles();
    const {t} = useTranslation();
    const {id} = useParams<{id: string}>();
    const history = useHistory();

    useEffect(() => {
        setScreen(currentScreen);
    }, [])

    const redirect = () => {
        if (customerLoadedData?.isUpdating) {
            history.push( "/f/appointment-manage/" + id);
        } else {
            history.push( "/f/appointment/" + id);
        }
    }

    const onNext = () => {
        dispatch(setSlotsWarningOpen(false))
        const nextScreen: TScreen = isTransportationAvailable && currentScreen !== "transportationNeeds"
            ? "transportationNeeds"
            : isAppointmentTimingAvailable
                ? "appointmentTiming"
                : "appointmentSelection"
        dispatch(setCurrentFrameScreen(nextScreen));
        if (history.location.pathname.includes("welcome")) {
            redirect();
        }
    }

    const onCancel = () => {
        dispatch(setSlotsWarningOpen(false))
        setScreen("")
    }

    // todo unique text
    // todo remove double showing of the text

    return (
        <BaseModal
            width={450}
            open={isSlotsWarningOpen}
            onClose={onCancel}
        >
            <DialogTitle onClose={onCancel}>
                {isTransportationAvailable && screen !== "transportationNeeds"
                    ? <div>{t("Appointment availability depends on the service requested. Please continue to see available services and appointment times")}</div>
                    : <div>{t("Appointment availability depends on the requested transportation. Please continue to review options")}</div>}
            </DialogTitle>
            <div className={classes.wrapper}>
                <LoadingButton
                    loading={false}
                    fullWidth
                    onClick={onCancel}
                    variant="outlined"
                    color="primary">
                    {t("Cancel")}
                </LoadingButton>
                <LoadingButton
                    loading={false}
                    fullWidth
                    onClick={onNext}
                    variant="contained"
                    color="primary">
                    {t("Next")}
                </LoadingButton>
            </div>
        </BaseModal>
    );
};

export default SlotImpactedWarning;