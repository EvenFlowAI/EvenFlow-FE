import React from "react";
import { Button } from "@mui/material";

import { withStyles } from "tss-react/mui";

export const EditButton = withStyles(Button, {
  root: {
    textTransform: "none",
  },
});
