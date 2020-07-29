import {Button, Checkbox, FormControlLabel, Grid, Link, Paper, Typography} from "@material-ui/core";
import {TextField} from "../UI/TextField";
import {Link as RLink} from "react-router-dom";
import {LockOpen} from "@material-ui/icons";
import React from "react";

export const CustomerLogin = () => {
    return <Paper elevation={0} style={{padding: 30}}>
        <Typography variant="h1" style={{
            textTransform: "uppercase", textAlign: "center",
            fontSize: 36,
            fontWeight: "bold",
            marginBottom: 20
        }}>
            Welcome to EvenFlow
        </Typography>
        <TextField
            label="Email Address"
            spacing="normal"
            fullWidth
            placeholder="TYPE HERE"
            name="asd"
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
        <Grid container style={{marginBottom: 40}} alignItems="center">
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

        <Button
            color="primary"
            variant="contained"
            fullWidth
            startIcon={<LockOpen/>}
        >
            Log In
        </Button>
    </Paper>;
}
