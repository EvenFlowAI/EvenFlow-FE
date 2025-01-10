import { styled } from "@mui/material";

export const Container = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  minHeight: "100%",
  padding: 20,
  maxWidth: 1280,
  margin: "auto",
  [theme.breakpoints.down("md")]: {
    padding: 0,
  },
}));
