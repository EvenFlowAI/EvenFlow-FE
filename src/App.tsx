import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {Container, IconButton} from '@material-ui/core';
import {Login} from "./components/Login/Login";
import {Switch, Route} from 'react-router-dom';
import {Layout} from "./components/Layout/Layout";
import {Routes} from "./config/routes";
import {PrivateRoute} from "./utils/Routes";
import { ConfirmDialog } from './components/UI/ConfirmDialog';
import {ProviderContext, SnackbarProvider} from "notistack";
import {Close} from "@material-ui/icons";
import {EndUserLayout} from "./components/Layout/EndUserLayout";
import {AppointmentLayout} from "./components/Layout/AppointmentLayout";
import {AppointmentConfirmation} from "./components/AppointmentFlow/AppointmentConfirmation";
import {AppointmentFrameLayout} from "./components/Layout/AppointmentFrameLayout";
import ReactGA, {GaOptions} from 'react-ga';

const prodParentLinks = ['https://www.riverviewford.com/'];

const App = () => {
    const notificationsRef = useRef<ProviderContext>();
    const [trackerCreated, setTrackerCreated] = useState(false);

    function createTracker(opt_clientId = '') {
        if (!trackerCreated) {
            const options: GaOptions = {
                siteSpeedSampleRate: 100,
                cookieDomain: 'auto',
                allowLinker: true,
                storage: 'none',
            }
            if (opt_clientId) options.clientId = opt_clientId

            ReactGA.initialize("UA-210743216-3", {
                debug: true,
                titleCase: false,
                gaOptions: options,
            });
            setTrackerCreated(true);
        }
    }

    useEffect(() => {
        trackerCreated && ReactGA.ga('pageview', window.location.pathname + window.location.search);
    }, [trackerCreated])

    useEffect(() => {
        if (!trackerCreated) {
            window.addEventListener('message', function(event) {
                if (!prodParentLinks.includes(event.origin)) return;
                if (typeof event.data === 'string') createTracker(event.data);
            });
            setTimeout(createTracker, 3000);
        }
    }, [trackerCreated]);

    const handleClose = (key: React.ReactText) => () => {
        notificationsRef?.current?.closeSnackbar(key);
    }
    const shackAction = (key: React.ReactText) => {
        return <IconButton size="small" onClick={handleClose(key)}><Close htmlColor="#fff" /></IconButton>;
    }
    const isWin = window.navigator.appVersion.indexOf('Win') !== -1;

    return (
        <SnackbarProvider
            maxSnack={3}
            ref={notificationsRef}
            action={shackAction}
            anchorOrigin={{horizontal: "right", vertical: "top"}}
            variant="success">
            <Container component="main" maxWidth={false} className={isWin ? "winos" : undefined} disableGutters style={{
                height: "100vh", maxHeight: "-webkit-fill-available"}}>
                <ConfirmDialog/>
                <Switch>
                    <Route path={Routes.Login.Base} component={Login} />
                    <Route path={Routes.Account.Base} component={Login} />
                    <Route path={Routes.EndUser.Appointment} component={AppointmentLayout} />
                    <Route path={Routes.EndUser.AppointmentFrame} component={AppointmentFrameLayout} />
                    <Route path={Routes.EndUser.Confirmation} component={AppointmentConfirmation} />
                    <Route path={Routes.EndUser.CancelAppointment} component={EndUserLayout} />
                    <Route path={Routes.EndUser.EditAppointment} component={EndUserLayout} />
                    <Route path={Routes.EndUser.Base} component={EndUserLayout} />
                    <PrivateRoute path="/" component={Layout}/>
                </Switch>
            </Container>
        </SnackbarProvider>
    );
}

export default App;
