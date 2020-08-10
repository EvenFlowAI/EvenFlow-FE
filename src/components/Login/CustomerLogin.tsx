import {Checkbox, FormControlLabel, Grid, Link} from "@material-ui/core";
import {TextField} from "../UI/TextField";
import {Link as RLink, useHistory, useLocation} from "react-router-dom";
import {LockOpen} from "@material-ui/icons";
import React, {useState} from "react";
import {LoginHeader} from "./LoginHeader";
import {LoginContainer} from "./LoginContainer";
import {LoginButton} from "./LoginButton";
import {ICredentials} from "../../types/types";
import {useSnackbar} from "notistack";
import {authService} from "../../config/requests";
import {getAPIException} from "../../utils/utils";

export const CustomerLogin = () => {
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState<ICredentials>({email: '', password: ''});
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const {state: locationState} = useLocation();

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
        setCredentials({...credentials, [name]: value});
    }

    const handleLogin = async () => {
        if (!credentials.email || !credentials.password) {
            enqueueSnackbar("Please fill your credentials", {variant: "error"});
            return;
        }
        setLoading(true);
        try {
            await authService.login(credentials);
            // Loading here because of history unmounts component
            setLoading(false);
            history.replace(locationState && locationState.from ? locationState.from : "/");
        } catch (e) {
            enqueueSnackbar(getAPIException(e), {variant: "error"});
            setLoading(false);
        }
    };


    return <LoginContainer>
        <LoginHeader title="Welcome to EvenFlow" />
        <TextField
            label="Email Address"
            spacing="normal"
            fullWidth
            placeholder="TYPE HERE"
            name="email"
            autoComplete={'current-email'}
            value={credentials.email}
            onChange={handleChange}
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
            onChange={handleChange}
            value={credentials.password}
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
