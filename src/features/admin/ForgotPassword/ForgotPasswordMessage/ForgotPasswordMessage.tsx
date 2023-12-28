import React from "react";
import {useHistory} from "react-router-dom";
import {LoginContainer} from "../../../../components/styled/LoginContainer";
import {LoginTitle} from "../../../../components/wrappers/LoginTitle/LoginTitle";
import {LoginTextContent} from "../../../../components/wrappers/LoginTextContent/LoginTextContent";
import {LoginButton} from "../../../../components/styled/LoginButton";

const messageContent = (
    <>We sent you a link to reset your password.<br/> Did not get an email? Check also spam holder</>
);

export const Message = () => {
    const history = useHistory();
    const handleBack = () => {
        history.push('/login');
    }

    return <LoginContainer>
        <LoginTitle title="Check your email"/>
        <LoginTextContent content={messageContent}/>
        <LoginButton fullWidth onClick={handleBack}>Close</LoginButton>
    </LoginContainer>;
};