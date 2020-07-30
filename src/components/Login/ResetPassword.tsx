import React, {useState} from "react";

import {LoginContainer} from "./LoginContainer";
import {LoginHeader} from "./LoginHeader";
import { TextField } from "../UI/TextField";
import {LoginButton} from "./LoginButton";
import {useSnackbar} from "notistack";


export const ResetPassword = () => {
    const [{newPassword, confirmPassword}, setPassword] = useState({newPassword: '', confirmPassword: ''});
    const {enqueueSnackbar} = useSnackbar();
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        setPassword({newPassword, confirmPassword, [e.target.name]: e.target.value});
    };
    const handleResetPassword = () => {
        if (!newPassword) {
            enqueueSnackbar("Invalid Password", {variant: "error"});
        }
        if (newPassword !== confirmPassword) {
            enqueueSnackbar("Passwords do not match", {variant: "error"});
        }
        enqueueSnackbar("Not connected");
    }

    return <LoginContainer>
        <LoginHeader title="Reset your password" />
        <TextField
            label="New password"
            value={newPassword}
            onChange={handleChange}
            name="newPassword"
            id="newPassword"
            type="password"
            spacing="normal"
            fullWidth
        />
        <TextField
            label="Confirm new password"
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            onChange={handleChange}
            value={confirmPassword}
            fullWidth
        />
        <LoginButton
            type="submit"
            onSubmit={handleResetPassword}
            onClick={handleResetPassword}
        >Reset password</LoginButton>
    </LoginContainer>;
}
