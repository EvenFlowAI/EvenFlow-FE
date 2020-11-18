import React, {useEffect} from 'react';
import {endUserTheme} from "../../theme/theme";
import {EndUserBar} from "../NavBar/EndUserBar";
import {ThemeProvider} from "@material-ui/core";
import {Route, Switch, useParams} from "react-router-dom";
import {Routes} from "../../config/routes";
import {AppointmentFlow} from "../AppointmentFlow/AppointmentFlow";
import {useDispatch} from "react-redux";
import {loadSCProfile} from "../../store/reducers/appointment/actions";

export const AppointmentLayout = () => {
    const {id} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        if (id && Number(id)) {
            dispatch(loadSCProfile(Number(id)));
        }
    }, [id, dispatch]);

    return <ThemeProvider theme={endUserTheme}>
        <div style={{
            display: "flex",
            flexFlow: "column nowrap",
            justifyContent: "stretch",
            height: "100%",
            width: "100%"
        }}>
            <EndUserBar />
            <Switch>
                <Route path={Routes.EndUser.Appointment} component={AppointmentFlow} />
            </Switch>
        </div>
    </ThemeProvider>
};