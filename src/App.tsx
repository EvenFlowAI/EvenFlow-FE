import React from 'react';
import './App.css';
import {Button, Container, Grid, Typography} from '@material-ui/core';
import {TextField} from "./components/UI/TextField";
import withStyles from "@material-ui/core/styles/withStyles";


const StyleTextField = withStyles(theme => ({root: {marginBottom: theme.spacing(3)}}))(TextField);


const  App = () => {
    return (
        <Container component="main" style={{padding: 20}}>
            <Grid container spacing={5}>
                <Grid item xs={4} />
                <Grid item xs={8}>
                    <Typography variant="h2">
                        Welcome to EvenFlow
                    </Typography>
                    <StyleTextField
                        label="Email Address"
                        fullWidth
                        placeholder="TYPE HERE"
                        name="asd"
                        autoComplete="off"
                        id="email"
                        autoFocus
                        margin="dense"
                    />
                    <StyleTextField
                        fullWidth
                        name="password"
                        type="password"
                        label="Password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button variant="contained" fullWidth>
                        Log In
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}

export default App;
