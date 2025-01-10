import React from "react";
import { CheckCircle } from "@mui/icons-material";

export const CheckmarkCircle: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{ val?: boolean }>>
> = ({ val }) => {
  return val ? <CheckCircle color="primary" /> : <span>-</span>;
};
