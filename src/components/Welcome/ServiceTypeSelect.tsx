import React from 'react';
import {Grid} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {useStyles} from "./CustomerSelect";
import {RootState} from "../../store/rootReducer";
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {
    getBlankCustomer,
    getBlankVehicle,
    saveCustomerCache,
    setCustomerLoadedData
} from "../../store/reducers/appointment/actions";
import {setCurrentFrameScreen, setServiceType, setVehicle} from "../../store/reducers/appointmentFrameReducer/actions";
import ReactGA from "react-ga";

type TProps = {
    onLogin: () => void;
    onComplete: (serviceType: EServiceType) => void;
};

const ServiceTypeSelect: React.FC<TProps> = ({ onLogin, onComplete }) => {
    const {userType} = useSelector((state: RootState) => state.appointmentFrame);
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleUser = (serviceType: EServiceType) => {
        if (userType === EUserType.Existing) {
            return onLogin();
        }
        if (userType === EUserType.New) {
            const c = getBlankCustomer();
            dispatch(setCustomerLoadedData(c));
            dispatch(setVehicle(getBlankVehicle()));
            saveCustomerCache(c);
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Enters Page',
                label: `As New User`,
            });
            onComplete(serviceType);
        }
    }

    const handleVisit = () => {
        dispatch(setServiceType(EServiceType.VisitCenter))
        handleUser(EServiceType.VisitCenter);
    }

    const handleMobile = () => {
        dispatch(setServiceType(EServiceType.Mobile));
        dispatch(setCurrentFrameScreen("location"));
        handleUser(EServiceType.Mobile);
    }

    return (
        <Grid className={classes.buttonsContainer}
              alignItems="stretch"
              container
              spacing={4}>
            <Grid item xs={12} sm={12} md={6}>
                <div onClick={handleVisit} className={classes.button}>
                    <span>Visit Center</span>
                </div>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <div onClick={handleMobile} className={classes.button}>
                    <span>Mobile</span>
                </div>
            </Grid>
        </Grid>
    );
};

export default ServiceTypeSelect;