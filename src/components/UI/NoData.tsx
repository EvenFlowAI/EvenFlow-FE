import React from "react";
import {Typography} from "@material-ui/core";


type Props = {
    title?: string;
}

export const NoData: React.FC<Props> = props => {
    return <Typography variant="body1">{props.title || "No data"}</Typography>
}