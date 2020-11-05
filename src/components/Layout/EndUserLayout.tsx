import React from 'react';
import {Switch, Route} from "react-router-dom";
import {endUserTheme} from "../../theme/theme";
import {ThemeProvider} from "@material-ui/core";
import {Routes} from "../../config/routes";
import {Welcome} from "../Welcome/Welcome";

export const EndUserLayout = () => {
    return <ThemeProvider theme={endUserTheme}>
        <Switch>
            <Route path={Routes.EndUser.Base} exact component={Welcome} />
        </Switch>
    </ThemeProvider>
};