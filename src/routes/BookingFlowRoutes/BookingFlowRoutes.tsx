import React from 'react';
import {Route, Switch} from "react-router-dom";
import {Welcome} from "../../pages/booking/Welcome/Welcome";
import {CancelAppointment} from "../../pages/booking/CancelAppointment/CancelAppointment";
import {EditAppointment} from "../../pages/booking/EditAppointment/EditAppointment";
import {Routes} from "../constants";

const BookingFlowRoutes = () => {
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