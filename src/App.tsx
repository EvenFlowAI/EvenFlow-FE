import React from 'react';
import './App.css';
import {Container} from '@material-ui/core';
import {Login} from "./components/Login/Login";
import {Switch, Route} from 'react-router-dom';
import {Layout} from "./components/Layout/Layout";
import {Routes} from "./config/routes";
import {PrivateRoute} from "./utils/Routes";
import { ConfirmDialog } from './components/UI/ConfirmDialog';

const App = () => {
    return (
        <Container component="main" maxWidth={false} disableGutters style={{height: "100vh"}}>
            <ConfirmDialog />
            <Switch>
                <Route path={Routes.Login.Base} component={Login} />
                <Route path={Routes.Account.Verification} component={Login} />
                <PrivateRoute path="/" component={Layout} />
            </Switch>
        </Container>
    );
}

export default App;
