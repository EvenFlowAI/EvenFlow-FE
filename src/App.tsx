import React, {useEffect, useRef} from 'react';
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

// ReactGA.initialize("UA-210743216-3", {
//     debug: true,
//     titleCase: false,
//     gaOptions: {
//         siteSpeedSampleRate: 100,
//         cookieDomain: 'auto',
//         allowLinker: true,
//     },
//     alwaysSendToDefaultTracker: false,
// });

const App = () => {
    const notificationsRef = useRef<ProviderContext>();
    let trackerCreated = false;

    function createTracker(opt_clientId: string | undefined) {
        if (!trackerCreated) {
            const options: GaOptions = {
                siteSpeedSampleRate: 100,
                cookieDomain: 'auto',
                allowLinker: true,
            }
            if (opt_clientId) options.clientId = opt_clientId

            ReactGA.initialize("UA-210743216-5", {
                debug: true,
                titleCase: false,
                gaOptions: options,
            });
            trackerCreated = true;
        }
    }

    useEffect(() => {
        trackerCreated && ReactGA.pageview(window.location.pathname + window.location.search);
    }, [trackerCreated])

    useEffect(() => {
        // window.addEventListener('message', function(event) {
        //     // Ignores messages from untrusted domains.
        //     if (event.origin != 'https://www.riverviewford.com/' || 'https://testifraime.herokuapp.com/') return;
        //
        //     // Creates the tracker with the data from the parent page.
        //     createTracker(event.data);
        // });
        window.addEventListener('message', function(event) {
            // Ignores messages from untrusted domains.
            if (event.origin != 'https://www.riverviewford.com/' || 'https://testifraime.herokuapp.com/') return;
            console.log(event);

            ReactGA.initialize("UA-210743216-5", {
                debug: true,
                titleCase: false,
                gaOptions: {
                    siteSpeedSampleRate: 100,
                    cookieDomain: 'auto',
                    allowLinker: true,
                },
            });
        });

        // setTimeout(createTracker);
    }, []);

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
