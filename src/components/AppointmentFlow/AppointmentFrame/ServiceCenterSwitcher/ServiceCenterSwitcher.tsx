import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Loading} from "../../../UI/Loading";
import {useCurrentUser} from "../../../../utils/hooks";
import {useHistory} from "react-router-dom";
import {setCustomerLoadedData} from "../../../../store/reducers/appointment/actions";
import {
    clearAppointmentData, setServiceTypeOption,
    setSideBarSteps,
    setVehicle, setWelcomeScreenView
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {encodeSCID} from "../../../../utils/utils";
import {Routes} from "../../../../config/routes";

const useStyles = makeStyles((theme) => ({
    selectWrapper: {
        width: "100%",
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '12px 0 48px 0',
        [theme.breakpoints.down("sm")]: {
            justifyContent: 'center',
            marginBottom: 20,
            padding: '12px 0 0 0',
        }
    },
    textWrapper: {
        fontSize: 20,
        fontWeight: 600,
        cursor: "pointer",
        [theme.breakpoints.down("sm")]: {
            fontSize: 16,
        }
    }
}))

export const ServiceCenterSwitcher = () => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {welcomeScreenView} = useSelector((state: RootState) => state.appointmentFrame);
    const {shortLoading} = useSelector((state: RootState) => state.serviceCenters);
    const currentUser = useCurrentUser();
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory()

    const handleClick = () => {
        dispatch(clearAppointmentData());
        dispatch(setSideBarSteps([]));
        dispatch(setVehicle(null));
        dispatch(setCustomerLoadedData(null));
        dispatch(setWelcomeScreenView('serviceCenterSelect'))
        dispatch(setServiceTypeOption(null));
        if (scProfile) {
            const encoded = encodeSCID(scProfile.id)
            history.push(`${Routes.EndUser.Welcome}/${encoded}?frame=1`)
        }
    }

    return currentUser && scProfile && (welcomeScreenView && welcomeScreenView !== "serviceCenterSelect")
        ? <div className={classes.selectWrapper} onClick={handleClick}>
            { shortLoading
                ? <Loading/>
                : <div className={classes.textWrapper}>{scProfile?.name}</div>
            }
        </div>
        : null
}
