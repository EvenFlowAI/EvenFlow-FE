import React, {useState} from "react";
import {useLocation, useHistory} from "react-router-dom";
import {LoginHeader} from "../../../components/LoginHeader/LoginHeader";
import {LoginContainer} from "../../../components/styled/LoginContainer";
import {LoginButton} from "../../../components/styled/LoginButton";
import {Routes} from "../../../config/routes";
import {Api} from "../../../config/requests";
import {useException, useMessage} from "../../../utils/hooks";
import {InvalidLinkMessage} from "./InvalidLinkMessage/InvalidLinkMessage";
import {PasswordForm} from "./PasswordForm/PasswordForm";

export const EmailVerification: React.FC = () => {
    const [{password, password2}, setPassword] = useState({password: '', password2: ''});
    const {search} = useLocation();
    const showError = useException();
    const showMessage = useMessage();
    const history = useHistory();

    const handleChangePassword: React.ChangeEventHandler<HTMLInputElement> = e => {
        const {target: {name, value}} = e;
        setPassword({password, password2, [name]: value});
    }

    const confirmVerification = async () => {
        if (!password || password !== password2) {
            showError(!password ? "Please type your password" : "Passwords do not match");
        } else {
            try {
                await Api.call(Api.endpoints.Accounts.Verification, {data: {token, userId, password}});
                showMessage("Password set");
                history.replace(Routes.Login.Base);
            } catch (e) {
                showError(e);
            }
        }
    }

    const params = new URLSearchParams(search);
    const token = params.get('token');
    const userId = params.get('userId');

    return <LoginContainer>
        <LoginHeader title="Set your password" />
        {token && userId
            ? <>
                <PasswordForm password={password} password2={password2} onChange={handleChangePassword}/>
                <LoginButton fullWidth onClick={confirmVerification}>Set Password</LoginButton>
            </>
            : <InvalidLinkMessage />
        }
    </LoginContainer>;
}