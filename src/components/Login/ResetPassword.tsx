import React, {useState} from "react";

import {LoginContainer} from "./LoginContainer";
import {LoginHeader} from "./LoginHeader";
import { TextField } from "../UI/TextField";
import {LoginButton} from "./LoginButton";
import {useSnackbar} from "notistack";
import {useHistory, useLocation} from "react-router-dom";
import queryString from "query-string";
import {Routes} from "../../config/routes";
import {useException, useMessage} from "../../utils/hooks";
import {API} from "../../api/api";


export const ResetPassword = () => {
    const [{newPassword, confirmPassword}, setPassword] = useState({newPassword: '', confirmPassword: ''});
    const [loading, setLoading] = useState<boolean>(false);
    const {enqueueSnackbar} = useSnackbar();
    const {search} = useLocation();
    const history = useHistory();
    const showMessage = useMessage();
    const showError = useException();
    const {token, userId} = queryString.parse(search);

    if (!userId || !token) {
        history.push(Routes.Login.Base);
    }

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        setPassword({newPassword, confirmPassword, [e.target.name]: e.target.value});
    };
    const handleResetPassword = async () => {
        if (!newPassword) {
            enqueueSnackbar("Invalid Password", {variant: "error"});
        }
        if (newPassword !== confirmPassword) {
            enqueueSnackbar("Passwords do not match", {variant: "error"});
        }
        setLoading(true);
        try {
            await API.accounts.setNewPassword({newPassword, token: token as string, userId: userId as string});
            showMessage("Password successfully set");
            setLoading(false)
            history.push(Routes.Login.Base);
        } catch (e) {
            setLoading(false);
            showError(e);
        }
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
            loading={loading}
            fullWidth
            onSubmit={handleResetPassword}
            onClick={handleResetPassword}
        >Reset password</LoginButton>
    </LoginContainer>;
}
