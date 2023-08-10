import React from 'react';
import {BaseModal, DialogTitle} from "../BaseModal";
import {LoadingButton} from "../../UI/Button";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {setSlotsWarningOpen} from "../../../store/reducers/modals/actions";
import {setCurrentFrameScreen} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";

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
})

const SlotImpactedWarning = () => {
    const {isSlotsWarningOpen} = useSelector((state: RootState) => state.modals);
    const {isAppointmentTimingAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t} = useTranslation();

    const onSlotsWarningClick = () => {
        dispatch(setSlotsWarningOpen(false))
        dispatch(setCurrentFrameScreen(isAppointmentTimingAvailable ? "appointmentTiming" : "appointmentSelection"));
    }

    const onClose = () => {
        dispatch(setSlotsWarningOpen(false))
    }

    return (
        <BaseModal
            width={450}
            open={isSlotsWarningOpen}
            onClose={onClose}
        >
            <DialogTitle onClose={onClose}>
                <div>{t("Date and time of available appointments depends on the service requested.")}</div>
                <div>{t("Please continue to see available dates and times for you requested change")}</div>
            </DialogTitle>
                <div className={classes.wrapper}>
                    <LoadingButton
                        loading={false}
                        fullWidth
                        onClick={onSlotsWarningClick}
                        variant="outlined"
                        color="primary">
                        {t("Close")}
                    </LoadingButton>
                </div>
        </BaseModal>
    );
};

export default SlotImpactedWarning;