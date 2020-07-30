import {Checkbox, FormControlLabel, Grid, Link} from "@material-ui/core";
import {TextField} from "../UI/TextField";
import {Link as RLink} from "react-router-dom";
import {LockOpen} from "@material-ui/icons";
import React, {useState} from "react";
import {LoginHeader} from "./LoginHeader";
import {LoginContainer} from "./LoginContainer";
import {LoginButton} from "./LoginButton";

export const CustomerLogin = () => {
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setLoading(true);
        setTimeout(() => {setLoading(false)}, 1000);
    };


    return <LoginContainer>
        <LoginHeader title="Welcome to EvenFlow" />
        <TextField
            label="Email Address"
            spacing="normal"
            fullWidth
            placeholder="TYPE HERE"
            name="email"
            autoComplete="off"
            id="email"
            autoFocus
        />
        <TextField
            fullWidth
            name="password"
            type="password"
            label="Password"
            spacing="normal"
            placeholder="TYPE HERE"
            id="password"
            autoComplete="current-password"
        />
        <Grid container alignItems="center">
            <Grid item xs={6}>
                <FormControlLabel
                    label="Keep me signed in"
                    control={<Checkbox color="primary"/>}
                />
            </Grid>
            <Grid item xs={6} style={{textAlign: "right"}}>
                <Link style={{fontWeight: "bold"}} component={RLink} to="/login/forgot-password">FORGOT PASSWORD?</Link>
            </Grid>
        </Grid>

        <LoginButton startIcon={<LockOpen/>} loading={loading} onClick={handleLogin}>
            Log In
        </LoginButton>
    </LoginContainer>;
}
