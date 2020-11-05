import React from 'react';
import {Switch, Route} from "react-router-dom";
import {endUserTheme} from "../../theme/theme";
import {ThemeProvider} from "@material-ui/core";
import {Routes} from "../../config/routes";
import {Welcome} from "../Welcome/Welcome";
import {EndUserBar} from "../NavBar/EndUserBar";

export const EndUserLayout = () => {
    return <ThemeProvider theme={endUserTheme}>
        <EndUserBar />
        <Switch>
            <Route path={Routes.EndUser.Base} exact component={Welcome} />
        </Switch>
    </ThemeProvider>
};