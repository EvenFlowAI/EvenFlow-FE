import React from "react";
import {LoginTextContent} from "../../../../components/wrappers/LoginTextContent/LoginTextContent";
import {Typography} from "@mui/material";
import {BackLink} from "../../../../components/wrappers/BackLink/BackLink";

import {Routes} from "../../../../routes/constants";

export const InvalidLinkMessage: React.FC<React.PropsWithChildren<React.PropsWithChildren<unknown>>> = () => {
    return <>
        <LoginTextContent content="Invalid url" />
        <Typography variant="body1" style={{textAlign: "center", marginTop: 20}}>
            Back to&nbsp;
            <BackLink to={Routes.Login.Base}>Sign In</BackLink>
        </Typography>
    </>;
}
