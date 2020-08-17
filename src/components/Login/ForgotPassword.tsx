import React, {useState} from "react";

import {LoginContainer} from "./LoginContainer";
import {LoginHeader} from "./LoginHeader";
import {LoginTextContent} from "./LoginTextContent";
import {TextField} from "../UI/TextField";
import {LoginButton} from "./LoginButton";
import {Typography} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {BackLink} from "./UI";
import {Routes} from "../../config/routes";

const content = "Enter the email you registered with and we will send you a link to reset your password";


const messageContent = (
    <>We sent you a link to reset your password.<br /> Did not get an email? Check also spam holder</>
);
const Message = () => {
    const history = useHistory();
    const handleBack = () => {
        history.push('/login');
    }

    return <LoginContainer>
        <LoginHeader title="Check your email" />
        <LoginTextContent content={messageContent} />
        <LoginButton onClick={handleBack}>Close</LoginButton>
    </LoginContainer>;
};

type FormProps = {
    onChange: React.ChangeEventHandler,
    onSubmit: React.EffectCallback
    email: string
}

const ForgotPasswordForm = (props: FormProps) => {
    return <LoginContainer>
        <LoginHeader title="Forgot password?" />
        <LoginTextContent content={content} />
        <TextField
            value={props.email}
            onChange={props.onChange}
            label="Email Address"
            fullWidth
            placeholder="TYPE HERE"
        />
        <LoginButton onClick={props.onSubmit}>Send Email</LoginButton>
        <Typography variant="body1" style={{marginTop: 20}}>
            Back to&nbsp;
            <BackLink to={Routes.Login.Base}>Sign In</BackLink>
        </Typography>
    </LoginContainer>;
};

export const ForgotPassword = () => {
    const [showMessage, changeShow] = useState(false);
    const [email, changeEmail] = useState('');

    const handleChangeEmail: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
        = (e) => changeEmail(e.target.value);

    const handleSubmit = () => changeShow(true);

    return showMessage
        ? <Message />
        : <ForgotPasswordForm
            onChange={handleChangeEmail}
            onSubmit={handleSubmit}
            email={email}
        />;
}