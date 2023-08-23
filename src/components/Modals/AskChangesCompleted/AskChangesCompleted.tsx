import React from 'react';
import {BaseModal, DialogTitle} from "../BaseModal";
import {LoadingButton} from "../../UI/Button";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {setChangesCompletedOpen, setSlotsWarningOpen} from "../../../store/reducers/modals/actions";
import {
    createOrUpdateAppointment,
    setCurrentFrameScreen
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {decodeSCID} from "../../../utils/utils";
import {useHistory, useParams} from "react-router-dom";
import {useCurrentUser, useException} from "../../../utils/hooks";
import {isMobile} from 'react-device-detect';
import {setAppointmentWasChanged} from "../../../store/reducers/appointment/actions";

const useStyles = makeStyles({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
        padding: '16px 80px',
        gap: 12,
        "& > div:not(:last-child)": {
            marginBottom: 12
        }
    },
    textButton: {
        color: "#142EA1",
        marginBottom: 12
    }
})

const AskChangesCompleted = () => {
    const {isAppointmentSaving, isUsualFlowNeeded, currentScreen} = useSelector((state: RootState) => state.appointmentFrame);
    const {isChangesCompletedOpen} = useSelector((state: RootState) => state.modals);
    const currentUser = useCurrentUser();
    const dispatch = useDispatch();
    const classes = useStyles();
    const showError = useException();
    const {t} = useTranslation();
    const {id} = useParams();
    const history = useHistory();

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
        showError(e)
        if (e.response?.data?.message?.toLowerCase().includes("time slot")) {
            dispatch(setChangesCompletedOpen(false))
            currentScreen !== "appointmentSelection" && dispatch(setSlotsWarningOpen(true))
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
                    {isUsualFlowNeeded
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
                        {t("Yes, no other changes needed")}
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