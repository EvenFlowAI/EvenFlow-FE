import React from "react";
import {Typography} from "@material-ui/core";


type Props = {content: React.ReactElement | string};

export const LoginTextContent: React.FC<Props> = props => {
    return <Typography align="center" variant="body1" style={{marginBottom: 30, padding: "0 60px"}}>{props.content}</Typography>;
}
