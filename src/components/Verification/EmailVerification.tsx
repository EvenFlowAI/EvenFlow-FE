import React, {useState} from "react";
import {useLocation, useHistory} from "react-router-dom";
import {LoginHeader} from "../Login/LoginHeader";
import {LoginContainer} from "../Login/LoginContainer";
import {LoginButton} from "../Login/LoginButton";
import {LoginTextContent} from "../Login/LoginTextContent";
import {Typography} from "@material-ui/core";
import {BackLink, PasswordForm} from "../Login/UI";
import {Routes} from "../../config/routes";
import {Api} from "../../config/requests";
import {useException, useMessage} from "../../utils/hooks";


const InvalidData: React.FC = () => {
    return <>
        <LoginTextContent content="Invalid url" />
        <Typography variant="body1" style={{textAlign: "center", marginTop: 20}}>
            Back to&nbsp;
            <BackLink to={Routes.Login.Base}>Sign In</BackLink>
        </Typography>
    </>;
}

export const EmailVerification: React.FC = () => {
    const {search} = useLocation();
    const [{password, password2}, setPassword] = useState({password: '', password2: ''});
    const handleChangePassword: React.ChangeEventHandler<HTMLInputElement> = e => {
        const {target: {name, value}} = e;
        setPassword({password, password2, [name]: value});
    }
    const showError = useException();
    const showMessage = useMessage();
    const history = useHistory();

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
            : <InvalidData />
        }
    </LoginContainer>;
}