import { styled } from "@mui/material";

export const Wrapper = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "3fr 2fr",
  gap: 10,
  alignItems: "stretch",
  justifyContent: "space-between",
  [theme.breakpoints.down("mdl")]: {
    flexDirection: "column",
    gridTemplateColumns: "1fr",
    gap: 8,
  },
}));
export const List = styled("ul")(({ theme }) => ({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "18px",
  fontSize: 16,
  fontWeight: "bold",
  [theme.breakpoints.down("mdl")]: {
    alignSelf: "flex-start",
    gap: "8px",
    width: "100%",
  },
  "& .service-item": {
    textTransform: "capitalize",
    [theme.breakpoints.down("mdl")]: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: "normal",
      "& .price": {
        fontSize: 20,
        fontWeight: "bold",
        "&>span": {
          fontSize: 14,
        },
      },
    },
    "& .service-list": {
      display: "block",
      maxHeight: 120,
      overflow: "auto",
      padding: "8px 8px 8px 0",
      [theme.breakpoints.down("mdl")]: {
        padding: 0,
      },
    },
  },
  "& ul": {
    listStyle: "none",
    marginTop: -10,
    "&>li": {
      textDecoration: "underline",
      cursor: "pointer",
      fontSize: 14,
      "&:hover": {
        textDecoration: "none",
      },
    },
  },
  "& .price": {
    [theme.breakpoints.down("mdl")]: {
      fontSize: 20,
    },
    fontWeight: "bold",
    "&>span": {
      fontSize: 18,
    },
  },
}));
export const PriceWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "space-between",
  textAlign: "right",
  [theme.breakpoints.down("md")]: {
    alignItems: "flex-start",
  },
  "& .price": {
    fontSize: 24,
    fontWeight: "bold",
    "&>span": {
      fontSize: 18,
    },
  },
  "& .info": {
    height: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    color: "#008331",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    [theme.breakpoints.down("md")]: {
      marginTop: 5,
    },
  },
}));
