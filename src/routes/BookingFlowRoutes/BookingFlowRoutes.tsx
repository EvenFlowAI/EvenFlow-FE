import React, {useEffect} from 'react';
import {Route, Switch} from "react-router-dom";
import {Welcome} from "../../pages/booking/Welcome/Welcome";
import {CancelAppointment} from "../../pages/booking/CancelAppointment/CancelAppointment";
import {EditAppointment} from "../../pages/booking/EditAppointment/EditAppointment";
import {Routes} from "../constants";
import {loadFirstScreenOptionsByQuery} from "../../store/reducers/serviceTypes/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";

const BookingFlowRoutes = () => {
    // const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    // const {scProfile} = useSelector((state: RootState) => state.appointment);
    // const dispatch = useDispatch();
    //
    // useEffect(() => {
    //     if (scProfile?.id && config?.length) {
    //         dispatch(loadFirstScreenOptionsByQuery(scProfile?.id))
    //     }
    // }, [scProfile, config])

    return (
        <Switch>
            <Route path={Routes.EndUser.Base} exact component={Welcome} />
            <Route path={Routes.EndUser.CancelAppointment} exact component={CancelAppointment} />
            <Route path={Routes.EndUser.CancelAppointmentFromEmail} exact component={CancelAppointment} />
            <Route path={Routes.EndUser.EditAppointment} exact component={EditAppointment} />
            <Route path={Routes.EndUser.EditAppointmentFromEmail} exact component={EditAppointment} />
        </Switch>
    );
};

export default BookingFlowRoutes;