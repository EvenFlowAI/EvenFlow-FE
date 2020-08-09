import React, {useState} from 'react';
import './App.css';
import {Container} from '@material-ui/core';
import {Login} from "./components/Login/Login";
import {Switch, Route} from 'react-router-dom';
import {Layout} from "./components/Layout/Layout";
import {Routes} from "./config/routes";
import {PrivateRoute} from "./utils/Routes";
import { AuthContext } from './context/auth';
import {ITokens} from "./types/types";

const  App = () => {
    const tString = localStorage.getItem("tk");
    const existingTokens: ITokens = JSON.parse(tString || "{}");
    const [tokens, setAuthTokens] = useState<ITokens>(existingTokens);

    const setTokens = (tokens: ITokens) => {
        localStorage.setItem("tk", JSON.stringify(tokens));
        setAuthTokens(tokens);
    }
    return (
        <AuthContext.Provider value={{tokens, setTokens}}>
            <Container component="main" maxWidth={false} disableGutters style={{height: "100vh"}}>
                <Switch>
                    <Route path={Routes.Login.Base} component={Login} />
                    <PrivateRoute path="/" component={Layout} />
                </Switch>
            </Container>
        </AuthContext.Provider>
    );
}

export default App;
