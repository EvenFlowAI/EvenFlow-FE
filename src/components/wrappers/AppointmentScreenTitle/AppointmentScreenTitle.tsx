import { styled } from "@mui/material";
import React from "react";

const Wrapper = styled("h1")(({ theme }) => ({
  fontSize: 28,
  fontWeight: 700,
  margin: 0,
  alignSelf: "flex-start",
  [theme.breakpoints.down("mdl")]: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 20,
    lineHeight: "26px",
    marginBottom: 12,
  },
}));

export const AppointmentScreenTitle: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<unknown>>
> = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};
