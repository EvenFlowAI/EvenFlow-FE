import React from 'react';
import {BaseModal, DialogTitle} from "../BaseModal";
import {LoadingButton} from "../../UI/Button";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {setServiceWarningOpen} from "../../../store/reducers/modals/actions";
import {
    clearSelectedServices, setAddress,
    setCurrentFrameScreen, setServiceTypeOption,
    setUsualFlowNeeded, setWelcomeScreenView, setZipCode
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useHistory, useParams} from "react-router-dom";
import {Routes} from "../../../config/routes";

const useStyles = makeStyles({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: "space-between",
        padding: '16px 80px',
        "& > div:not(:last-child)": {
            marginRight: 20
        }
    },
})

const ServiceImpactedWarning = () => {
    const {isServiceWarningOpen} = useSelector((state: RootState) => state.modals);
    const {appointmentByKey} = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t} = useTranslation();
    const {id} = useParams();
    const history = useHistory();

    const onServiceWarningClick = () => {
        dispatch(clearSelectedServices());
        dispatch(setUsualFlowNeeded(true));
        dispatch(setCurrentFrameScreen("serviceNeeds"));
        dispatch(setServiceWarningOpen(false));
        if (history.location.pathname.includes("welcome")) {
            history.push( "/f/appointment/" + id);
        }
    }

    const onCancel = () => {
        dispatch(setServiceTypeOption(appointmentByKey?.serviceTypeOption ?? null))
        dispatch(setCurrentFrameScreen("manageAppointment"));
        dispatch(setServiceWarningOpen(false));
        if (history.location.pathname.includes("welcome")) {
            history.push( "/f/appointment/" + id);
        } else {
            dispatch(setAddress(null));
            dispatch(setZipCode(""));
        }
    }

    // const onCancel = () => {
    //     dispatch(setServiceTypeOption(appointmentByKey?.serviceTypeOption ?? null))
    //     dispatch(setWelcomeScreenView("serviceSelect"));
    //     dispatch(setServiceWarningOpen(false));
    //     if (!history.location.pathname.includes("welcome")) {
    //         dispatch(setAddress(null));
    //         dispatch(setZipCode(""));
    //         history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
    //     }
    // }

    return (
        <BaseModal
            width={450}
            open={isServiceWarningOpen}
            onClose={onCancel}
        >
            <DialogTitle onClose={onCancel}>
                <div>{t("The available services supported with our mobile truck service may be different than when you visit our service center.")}</div>
                <div>{t("Please continue to see the available services and the available appointment dates and times")}</div>
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
                    onClick={onServiceWarningClick}
                    variant="contained"
                    color="primary">
                    {t("Proceed")}
                </LoadingButton>
            </div>
        </BaseModal>
    );
};

export default ServiceImpactedWarning;