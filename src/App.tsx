import React, {useRef} from 'react';
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

const App = () => {
    const notificationsRef = useRef<ProviderContext>();
    const handleClose = (key: React.ReactText) => () => {
        notificationsRef?.current?.closeSnackbar(key);
    }
    const shackAction = (key: React.ReactText) => {
        return <IconButton size="small" onClick={handleClose(key)}><Close htmlColor="#fff" /></IconButton>;
    }

    return (
        <SnackbarProvider
            maxSnack={3}
            ref={notificationsRef}
            action={shackAction}
            anchorOrigin={{horizontal: "right", vertical: "top"}}
            variant="success">
            <Container component="main" maxWidth={false} disableGutters style={{height: "100vh"}}>
                <ConfirmDialog/>
                <Switch>
                    <Route path={Routes.Login.Base} component={Login}/>
                    <Route path={Routes.Account.Verification} component={Login}/>
                    <PrivateRoute path="/" component={Layout}/>
                </Switch>
            </Container>
        </SnackbarProvider>
    );
}

export default App;
