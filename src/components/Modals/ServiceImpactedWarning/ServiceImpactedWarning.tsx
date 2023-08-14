import React from 'react';
import {BaseModal, DialogTitle} from "../BaseModal";
import {LoadingButton} from "../../UI/Button";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {setServiceWarningOpen, setSlotsWarningOpen} from "../../../store/reducers/modals/actions";
import {
    clearSelectedServices,
    setCurrentFrameScreen,
    setUsualFlowNeeded
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useHistory, useParams} from "react-router-dom";

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

const ServiceImpactedWarning = () => {
    const {isServiceWarningOpen} = useSelector((state: RootState) => state.modals);
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

    return (
        <BaseModal
            width={450}
            open={isServiceWarningOpen}
            onClose={onServiceWarningClick}
        >
            <DialogTitle onClose={onServiceWarningClick}>
                <div>{t("The available services supported with our mobile truck service may be different than when you visit our service center.")}</div>
                <div>{t("Please continue to see the available services and the available appointment dates and times")}</div>
            </DialogTitle>
            <div className={classes.wrapper}>
                <LoadingButton
                    loading={false}
                    fullWidth
                    onClick={onServiceWarningClick}
                    variant="outlined"
                    color="primary">
                    {t("Close")}
                </LoadingButton>
            </div>
        </BaseModal>
    );
};

export default ServiceImpactedWarning;