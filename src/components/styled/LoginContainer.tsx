import React from "react";
import { Paper } from "@mui/material";

import { withStyles } from "tss-react/mui";

const BaseLoginContainer: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<unknown>>
> = (props) => {
  return <Paper elevation={0}>{props.children}</Paper>;
};

export const LoginContainer = withStyles(BaseLoginContainer, {
  root: { padding: 30 },
});
