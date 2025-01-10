import React from "react";
import { Typography } from "@mui/material";

type Props = {
  title?: string;
};

export const NoData: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<Props>>
> = (props) => {
  return (
    <Typography variant="body1" align="center">
      {props.title || "No data"}
    </Typography>
  );
};
