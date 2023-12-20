import React from "react";
import {Link, LinkProps} from "@material-ui/core";
import {Link as BLink} from "react-router-dom";

export const BackLink: React.FC<LinkProps & {to: string}> = props => {
    return <Link
        style={{fontWeight: "bold", textTransform: "uppercase"}}
        component={BLink}
        to={props.to}
    >{props.children}</Link>;
};
