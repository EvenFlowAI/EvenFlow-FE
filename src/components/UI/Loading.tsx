import React from "react";
import {CircularProgressProps, CircularProgress} from "@material-ui/core";

export const Loading: React.FC<CircularProgressProps> = props => {
    return <CircularProgress {...props} />;
}
