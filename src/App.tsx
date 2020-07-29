import React from 'react';
import './App.css';
import {Container} from '@material-ui/core';
import {Login} from "./components/Login/Login";
import {Switch, Route, Redirect} from 'react-router-dom';

const  App = () => {
    return (
        <Container component="main" maxWidth={false} disableGutters style={{height: "100vh"}}>
            <Switch>
                <Route path="/login" component={Login}/>
                <Redirect to="/login" />
            </Switch>
        </Container>
    );
}

export default App;
