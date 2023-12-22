import React from 'react';
import {BaseModal, DialogTitle} from "../../BaseModal/BaseModal";
import {useTranslation} from "react-i18next";
import {setSlotsWarningOpen} from "../../../../store/reducers/modals/actions";
import {setCurrentFrameScreen} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useHistory, useParams} from "react-router-dom";
import {useStyles} from "./styles";
import {LoadingButton} from "../../../buttons/LoadingButton/LoadingButton";

const SlotImpactedWarning = () => {
    const {isSlotsWarningOpen} = useSelector((state: RootState) => state.modals);
    const {isAppointmentTimingAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t} = useTranslation();
    const {id} = useParams();
    const history = useHistory();

    const onNext = () => {
        dispatch(setCurrentFrameScreen(isAppointmentTimingAvailable ? "appointmentTiming" : "appointmentSelection"));
        dispatch(setSlotsWarningOpen(false))
        if (history.location.pathname.includes("welcome")) {
            history.push( "/f/appointment/" + id);
        }
    }

    const onCancel = () => {
        dispatch(setSlotsWarningOpen(false))
    }

    return (
        <BaseModal
            width={450}
            open={isSlotsWarningOpen}
            onClose={onCancel}
        >
            <DialogTitle onClose={onCancel}>
                <div>{t("Appointment availability depends on the service requested.")}</div>
                <div>{t("Please continue to see available dates and times for you requested change")}</div>
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