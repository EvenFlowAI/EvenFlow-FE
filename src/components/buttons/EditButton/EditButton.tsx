import React from "react";
import { Button } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export const EditButton = withStyles({
    root: {
        textTransform: "none"
    }
})(Button);