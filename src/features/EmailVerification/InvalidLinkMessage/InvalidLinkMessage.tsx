import React from "react";
import {LoginTextContent} from "../../../components/Login/LoginTextContent";
import {Typography} from "@material-ui/core";
import {BackLink} from "../../../components/Login/UI";
import {Routes} from "../../../config/routes";

export const InvalidLinkMessage: React.FC = () => {
    return <>
        <LoginTextContent content="Invalid url" />
        <Typography variant="body1" style={{textAlign: "center", marginTop: 20}}>
            Back to&nbsp;
            <BackLink to={Routes.Login.Base}>Sign In</BackLink>
        </Typography>
    </>;
}
