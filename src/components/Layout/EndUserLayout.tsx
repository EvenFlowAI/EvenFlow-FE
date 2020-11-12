import React, {useEffect} from 'react';
import {Switch, Route, useParams} from "react-router-dom";
import {endUserTheme} from "../../theme/theme";
import {ThemeProvider} from "@material-ui/core";
import {Routes} from "../../config/routes";
import {Welcome} from "../Welcome/Welcome";
import {EndUserBar} from "../NavBar/EndUserBar";
import {useDispatch} from "react-redux";
import {loadSCProfile} from "../../store/reducers/appointment/actions";

export const EndUserLayout = () => {
    const {id} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        if (id && Number(id)) {
            dispatch(loadSCProfile(Number(id)));
        }
    }, [id, dispatch]);

    return <ThemeProvider theme={endUserTheme}>
        <EndUserBar />
        <Switch>
            <Route path={Routes.EndUser.Base} exact component={Welcome} />
        </Switch>
    </ThemeProvider>
};