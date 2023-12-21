import React, {useMemo} from 'react';
import {BaseModal, DialogTitle} from "../../../BaseModal/BaseModal";
import {useTranslation} from "react-i18next";
import {Button} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {setChangesCompletedOpen, setSlotsWarningOpen} from "../../../../store/reducers/modals/actions";
import {
    createOrUpdateAppointment,
    setCurrentFrameScreen
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {decodeSCID} from "../../../../utils/utils";
import {useHistory, useParams} from "react-router-dom";
import {isMobile} from 'react-device-detect';
import {setAppointmentWasChanged} from "../../../../store/reducers/appointment/actions";
import {useStyles} from "./styles";
import {LoadingButton} from "../../../LoadingButton/LoadingButton";
import {useException} from "../../../../hooks/useException/useException";
import {useCurrentUser} from "../../../../hooks/useCurrentUser/useCurrentUser";

const AskChangesCompleted = () => {
    const {
        isAppointmentSaving,
        isUsualFlowNeeded,
        currentScreen,
        appointmentByKey,
        serviceTypeOption,
        editingPosition
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {isChangesCompletedOpen} = useSelector((state: RootState) => state.modals);
    const currentUser = useCurrentUser();
    const dispatch = useDispatch();
    const classes = useStyles();
    const showError = useException();
    const {t} = useTranslation();
    const {id} = useParams();
    const history = useHistory();
    const isNewServiceOption = useMemo(() => {
        return editingPosition === 'serviceOption' && serviceTypeOption?.id !== appointmentByKey?.serviceTypeOption?.id
    }, [editingPosition, serviceTypeOption, appointmentByKey])

    const onClose = () => {
        dispatch(setChangesCompletedOpen(false))
    }

    const redirectToAppointmentFrame = () => {
        if (history.location.pathname.includes("welcome")) {
            history.push( "/f/appointment/" + id);
        }
    }

    const onAdditionalChanges = () => {
        dispatch(setAppointmentWasChanged(true))
        dispatch(setChangesCompletedOpen(false))
        dispatch(setCurrentFrameScreen("manageAppointment"))
        redirectToAppointmentFrame()
    }

    const onSuccessAppointmentUpdate = () => {
        dispatch(setChangesCompletedOpen(false))
        dispatch(setCurrentFrameScreen("appointmentConfirmed"))
        redirectToAppointmentFrame()
    }

    const handleError = (e: any) => {
        const timeSlotUnavailable = e.response?.data?.message?.toLowerCase().includes("time slot");
        const dateForZoneUnavailable = e.response?.data?.message?.toLowerCase().includes("is not available for this geographic zone or for the date");
        if (timeSlotUnavailable || dateForZoneUnavailable) {
            dispatch(setChangesCompletedOpen(false))
            currentScreen !== "appointmentSelection" && dispatch(setSlotsWarningOpen(true))
        } else {
            showError(e)
        }
    }

    const handleChangesCompleted = async () => {
        dispatch(createOrUpdateAppointment(decodeSCID(id), onSuccessAppointmentUpdate, handleError, isMobile, Boolean(currentUser)))
    }

    return (
        <BaseModal
            width={600}
            open={isChangesCompletedOpen}
            onClose={onClose}
        >
            <DialogTitle onClose={onClose}>
                {t("Are you satisfied with the appointment changes?")}
            </DialogTitle>
                <div className={classes.wrapper}>
                    {isUsualFlowNeeded || isNewServiceOption
                        ? null
                        : <Button variant="text" className={classes.textButton} onClick={onAdditionalChanges}>
                            {t("I’d like to make additional changes")}
                        </Button>}
                    <LoadingButton
                        fullWidth
                        loading={isAppointmentSaving}
                        onClick={handleChangesCompleted}
                        color="primary"
                        variant="contained">
                        {t("Yes")}
                    </LoadingButton>
                    <LoadingButton
                        loading={isAppointmentSaving}
                        fullWidth
                        onClick={onClose}
                        variant="outlined"
                        color="primary">
                        {t("Cancel")}
                    </LoadingButton>
                </div>
        </BaseModal>
    );
};

export default AskChangesCompleted;