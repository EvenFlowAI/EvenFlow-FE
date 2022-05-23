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
import {clearAppointmentData, setServiceType, setVehicle} from "../../store/reducers/appointmentFrameReducer/actions";
import ReactGA from "react-ga";

type TProps = {
    onLogin: () => void;
    onComplete: (serviceType: EServiceType) => void;
};

const ServiceTypeSelect: React.FC<TProps> = ({onLogin, onComplete }) => {
    const {userType, isMobileServiceOn, isPickUpDropOffServiceOn} = useSelector((state: RootState) => state.appointmentFrame);
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

    const handleSelect = (service: EServiceType) => {
        dispatch(clearAppointmentData());
        dispatch(setServiceType(service));
        handleUser(service);
    }

    return (
        <Grid className={classes.buttonsContainer}
              alignItems="stretch"
              container
              spacing={4}>
            <Grid item xs={12} sm={12} md={isMobileServiceOn && isPickUpDropOffServiceOn ? 4 : 6}>
                <div onClick={() => handleSelect(EServiceType.VisitCenter)} className={classes.button}>
                    <span>Visit Center</span>
                </div>
            </Grid>
            {isMobileServiceOn
                ? <Grid item xs={12} sm={12} md={isPickUpDropOffServiceOn ? 4 : 6}>
                <div onClick={() => handleSelect(EServiceType.Mobile)} className={classes.button}>
                    <span>Mobile</span>
                </div>
            </Grid>
                : null}
            {isPickUpDropOffServiceOn
                ? <Grid item xs={12} sm={12} md={isMobileServiceOn ? 4 : 6}>
                <div onClick={() => handleSelect(EServiceType.PikUpDropOff)} className={classes.button}>
                    <span>Pick Up / Drop Off Service</span>
                </div>
            </Grid>
                : null}
        </Grid>
    );
};

export default ServiceTypeSelect;