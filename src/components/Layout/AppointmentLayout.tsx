import React from 'react';
import {endUserTheme} from "../../theme/theme";
import {EndUserBar} from "../NavBar/EndUserBar";
import {ThemeProvider} from "@material-ui/core";
import {Route, Switch} from "react-router-dom";
import {Routes} from "../../config/routes";
import {AppointmentFlow} from "../AppointmentFlow/AppointmentFlow";

export const AppointmentLayout = () => {
    return <ThemeProvider theme={endUserTheme}>
        <EndUserBar />
        <Switch>
            <Route path={Routes.EndUser.Appointment} component={AppointmentFlow} />
        </Switch>
    </ThemeProvider>
};