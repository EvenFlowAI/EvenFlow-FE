import React from 'react';
import {BaseModal, DialogTitle} from "../BaseModal";
import {LoadingButton} from "../../UI/Button";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {setServiceWarningOpen} from "../../../store/reducers/modals/actions";
import {
    clearSelectedServices,
    setCurrentFrameScreen, setServiceTypeOption,
    setUsualFlowNeeded, setWelcomeScreenView
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useHistory, useParams} from "react-router-dom";

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

    const onClose = () => {
        dispatch(setServiceWarningOpen(false));
    }

    const onNext = () => {
        dispatch(clearSelectedServices());
        dispatch(setUsualFlowNeeded(true));
        dispatch(setCurrentFrameScreen("serviceNeeds"));
        onClose()
        if (history.location.pathname.includes("welcome")) {
            history.push( "/f/appointment/" + id);
        }
    }

    const onCancel = () => {
        if (history.location.pathname.includes("welcome")) dispatch(setServiceTypeOption(appointmentByKey?.serviceTypeOption ?? null))
        dispatch(setWelcomeScreenView("serviceSelect"));
        onClose();
    }

    return (
        <BaseModal
            width={450}
            open={isServiceWarningOpen}
            onClose={onCancel}
        >
            <DialogTitle onClose={onCancel}>
                <div>{t("The services our Mobile Truck offer may be different from our Service Center.")}</div>
                <div>{t("Please continue to see available services and appointment times")}</div>
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

export default ServiceImpactedWarning;