import { styled } from "@mui/material";
import theme from "../../../../../theme/theme";

export const Paper = styled("div")(({ theme }) => ({
  boxShadow: "1px 5px 15px rgba(0, 0, 0, 0.25);",
  padding: 20,
  fontSize: 15,
  maxWidth: 700,
  [theme.breakpoints.up("sm")]: {
    minWidth: 600,
  },
  "& h3": {
    textTransform: "uppercase",
    gridColumnStart: 1,
    gridColumnEnd: 3,
    margin: "10px 0 0",
    padding: 0,
    fontSize: 24,
    textAlign: "center",
  },
}));

export const ButtonsWrapper = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "15px",
  marginBottom: 20,
  [theme.breakpoints.down("mdl")]: {
    display: "flex",
    flexDirection: "column",
    "& > div:first-child": {
      marginBottom: 12,
    },
  },
});

export const Wrapper = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  // gridTemplateColumns: "repeat(2, 1fr)",
  gap: "15px",
  marginBottom: 20,
  "& h2": {
    textTransform: "uppercase",
    gridColumnStart: 1,
    gridColumnEnd: 3,
    margin: "0 0 10px",
    padding: 0,
    fontSize: 19,
    textAlign: "center",
  },
  "& .item": {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  "&>div": {
    textAlign: "right",
  },
  "& .label": {
    textAlign: "left",
    textTransform: "uppercase",
    color: "#9FA2B4",
    fontWeight: "bold",
  },
  "& .emptyContainer": {
    width: "100%",
    minHeight: 300,
    minWidth: 300,
    gridColumn: "1 / 3",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  "& .content": {
    maxWidth: "50%",
  },
}));

export const Divider = styled("div")(({ theme }) => ({
  width: "100%",
  height: 2,
  gridColumnStart: 1,
  gridColumnEnd: 3,
  marginTop: 16,
  background: `repeating-linear-gradient(to right,
        ${theme.palette.divider} 0,${theme.palette.divider} 10px,
        transparent 10px,
        transparent 20px)`,
}));
