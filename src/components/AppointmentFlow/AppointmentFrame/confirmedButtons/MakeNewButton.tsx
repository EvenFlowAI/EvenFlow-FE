import React from 'react';
import {Button} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {
    clearAppointmentData, setAddress, setCity, setPoliticalState,
    setServiceOptionChanged, setSideBarSteps, setStreetName,
    setVehicle, setWelcomeScreenView, setZipCode
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {Routes} from "../../../../config/routes";
import {useTranslation} from "react-i18next";
import {useCurrentUser} from "../../../../utils/hooks";
import {useHistory, useParams} from "react-router-dom";

const MakeNewButton = () => {
    const {isAppointmentSaving,} = useSelector((state: RootState) => state.appointmentFrame)
    const currentUser = useCurrentUser();
    const dispatch = useDispatch();
    const isFrame = window.top !== window.self;
    const {t} = useTranslation();
    const {id} = useParams();
    const history = useHistory();

    const clearAddress = async () => {
        await dispatch(setStreetName(''))
        await dispatch(setCity(''))
        await dispatch(setPoliticalState(''))
        await dispatch(setAddress(null));
        await dispatch(setZipCode(''));
    }

    const onMakeNew = async () => {
        await dispatch(setVehicle(null));
        await dispatch(clearAppointmentData());
        await clearAddress()
        await dispatch(setServiceOptionChanged(false));
        await dispatch(setSideBarSteps([]));
        await dispatch(setWelcomeScreenView(currentUser ? "serviceCenterSelect" : "select"));
        history.push(`${Routes.EndUser.Welcome}/${id}?frame=1`)
    }

    return !isFrame ? <Button color="primary" fullWidth variant="outlined" onClick={onMakeNew} disabled={isAppointmentSaving}>
        {t("Make New Appointment")}
    </Button> : null
};

export default MakeNewButton;