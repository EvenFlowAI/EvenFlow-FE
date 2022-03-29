import React from 'react';
import {Grid} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {useStyles} from "./CustomerSelect";
import {RootState} from "../../store/rootReducer";
import {EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {
    getBlankCustomer,
    getBlankVehicle,
    saveCustomerCache,
    setCustomerLoadedData
} from "../../store/reducers/appointment/actions";
import {setVehicle} from "../../store/reducers/appointmentFrameReducer/actions";
import ReactGA from "react-ga";

type TProps = {
    onLogin: () => void;
    onComplete: () => void;
};

const ServiceTypeSelect: React.FC<TProps> = ({ onLogin, onComplete }) => {
    const {userType} = useSelector((state: RootState) => state.appointmentFrame);
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleVisit = () => {
        if (userType === EUserType.Existing) {
            onLogin();
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
            onComplete();
        }
    }

    const handleMobile = () => {
        // todo logic
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