import React from "react";
import {Typography} from "@mui/material";

type Props = {
    title?: string;
}

export const NoData: React.FC<Props> = props => {
    return <Typography variant="body1" align="center">{props.title || "No data"}</Typography>
}