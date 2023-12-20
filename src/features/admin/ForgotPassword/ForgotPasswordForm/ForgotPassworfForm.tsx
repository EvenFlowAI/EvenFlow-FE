import React from "react";
import {LoginContainer} from "../../../../components/styled/LoginContainer";
import {LoginHeader} from "../../../../components/LoginHeader/LoginHeader";
import {LoginTextContent} from "../../../../components/LoginTextContent/LoginTextContent";
import {TextField} from "../../../../components/FormControls/TextFieldStyled/TextField";
import {LoginButton} from "../../../../components/styled/LoginButton";
import {Typography} from "@material-ui/core";
import {BackLink} from "../../../../components/BackLink/BackLink";
import {Routes} from "../../../../config/routes";

type FormProps = {
    onChange: React.ChangeEventHandler;
    onSubmit: () => void;
    email: string;
    loading?: boolean;
}

export const ForgotPasswordForm = (props: FormProps) => {
    const content = "Enter the email you registered with and we will send you a link to reset your password";

    return <LoginContainer>
        <LoginHeader title="Forgot password?"/>
        <LoginTextContent content={content}/>
        <TextField
            value={props.email}
            onChange={props.onChange}
            label="Email Address"
            fullWidth
            placeholder="TYPE HERE"
        />
        <LoginButton loading={props.loading} fullWidth onClick={props.onSubmit}>Send Email</LoginButton>
        <Typography variant="body1" style={{marginTop: 20}}>
            Back to&nbsp;
            <BackLink to={Routes.Login.Base}>Sign In</BackLink>
        </Typography>
    </LoginContainer>;
};