import React from "react";
import {LoginTextContent} from "../../../../components/LoginTextContent/LoginTextContent";
import {Typography} from "@material-ui/core";
import {BackLink} from "../../../../components/UI/BackLink";
import {Routes} from "../../../../config/routes";

export const InvalidLinkMessage: React.FC = () => {
    return <>
        <LoginTextContent content="Invalid url" />
        <Typography variant="body1" style={{textAlign: "center", marginTop: 20}}>
            Back to&nbsp;
            <BackLink to={Routes.Login.Base}>Sign In</BackLink>
        </Typography>
    </>;
}
