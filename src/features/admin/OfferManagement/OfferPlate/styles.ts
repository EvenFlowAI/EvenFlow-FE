import { EOfferType, IOffer } from "../../../../store/reducers/offers/types";
import { makeStyles } from "tss-react/mui";
import { styled } from "@mui/material";

export type TStyleProps = {
  t: IOffer["type"];
};

export const Background = styled("div", {
  shouldForwardProp: (prop) => prop !== "t",
})<TStyleProps>(({ theme, t }) => ({
  position: "absolute",
  top: 0,
  left: "20%",
  right: 0,
  lineHeight: `${t === EOfferType.FreeService ? 8 : 11}rem`,
  userSelect: "none",
  fontSize: `${t === EOfferType.FreeService ? 8 : 11}rem`,
  opacity: 0.05,
  color: "#7898FF",
  fontWeight: "bold",
  textAlign: "center",
}));

export const Label = styled("span", {
  shouldForwardProp: (prop) => prop !== "t",
})<TStyleProps>(({ theme, t }) => ({
  paddingRight: "50%",
  fontSize: t === EOfferType.FreeService ? 18 : 32,
  fontWeight: "bold",
  textTransform: "uppercase",
}));

export const useStyles = makeStyles()({
  wrapper: {
    borderRadius: 0,
    padding: 20,
    position: "relative",
    minHeight: 200,
    height: "100%",
    overflow: "hidden",
  },
  title: {
    margin: 0,
    fontSize: 14,
    textTransform: "uppercase",
    paddingRight: 46,
  },
  edit: {
    position: "absolute",
    top: 8,
    right: 8,
    textTransform: "none",
    zIndex: 2,
  },
  content: {
    height: "100%",
    justifyContent: "space-between",
    display: "flex",
    flexFlow: "column nowrap",
  },
  info: {
    paddingRight: "60%",
    fontSize: 12,
  },
  data: {
    position: "absolute",
    top: 0,
    left: "40%",
    right: 0,
    bottom: 0,
    padding: 20,
    fontSize: 13,
    display: "flex",
    zIndex: 1,
    flexFlow: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    "&>span": {
      textAlign: "right",
      marginTop: 18,
    },
  },
});
