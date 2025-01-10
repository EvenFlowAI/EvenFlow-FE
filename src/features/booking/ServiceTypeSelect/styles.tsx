import { styled } from "@mui/material";
import React from "react";
import { mh400, mh600 } from "../CustomerSelect/constants";
import { makeStyles } from "tss-react/mui";

export const ServiceTypeCardsWrapper = styled("div")<{ cardsAmount: number }>(
  ({ theme, cardsAmount }) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cardsAmount}, 1fr)`,
    gap: "18px",
    marginTop: "5%",
    marginBottom: 20,
    justifyItems: cardsAmount === 1 ? "center" : "unset",
    "& > div": {
      minWidth: cardsAmount === 1 ? 440 : "unset",
    },
    [theme.breakpoints.down("md")]: {
      gridTemplateRows: cardsAmount > 3 ? "1fr 1fr" : "1fr",
      gridTemplateColumns:
        cardsAmount < 4 ? `repeat(${cardsAmount}, 1fr)` : "1fr 1fr",
    },
    [theme.breakpoints.down("mdl")]: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginTop: 16,
    },
  }),
);
export const Tagline = styled("div")<{
  taglineColor?: string;
}>(({ theme, taglineColor }) => ({
  minHeight: 40,
  width: "100%",
  display: "flex",
  justifyContent: "center",
  fontWeight: 600,
  fontSize: 24,
  lineHeight: "normal",
  paddingBottom: 16,
  color: taglineColor ? `#${taglineColor}` : "inherit",
  [theme.breakpoints.down("mdl")]: {
    minHeight: 0,
    fontSize: 16,
    paddingBottom: 0,
  },
}));

export const ServiceTypeButton = styled("div")<{
  isTaglinePresent: boolean;
}>(({ theme, isTaglinePresent }) => ({
  position: "relative",
  height: 300,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: isTaglinePresent ? 10 : 20,
  fontWeight: "bold",
  fontSize: 32,
  lineHeight: "normal",
  textAlign: "center",
  cursor: "pointer",
  padding: "16px 8px",
  border: "1px solid #DADADA",
  background: "#FFFFFF",
  transition: theme.transitions.create(["box-shadow"]),
  "&:hover": {
    boxShadow: "0 2px 8px rgba(0,0,0,.1)",
  },
  [mh600]: {
    fontSize: 22,
    padding: "7%",
  },
  [`${mh400} and (orientation: portrait)`]: {
    fontSize: 18,
    padding: "2%",
  },
  [theme.breakpoints.down("mdl")]: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "7px 10%",
    fontSize: 24,
    alignItems: "center",
    gap: 8,
  },
  "& .infoIcon": {
    position: "absolute",
    top: 8,
    right: 8,
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export const useServiceTypeStyles = makeStyles()((theme) => ({
  name: {
    width: "100%",
    fontSize: 32,
    lineHeight: "normal",
    [theme.breakpoints.down("mdl")]: {
      fontSize: 24,
    },
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },
}));
