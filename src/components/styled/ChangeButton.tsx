import { Button, styled } from "@mui/material";

export const ChangeButton = styled(Button)(({ theme }) => ({
  width: "fit-content",
  justifyContent: "flex-start",
  padding: 8,
  marginBottom: 50,
  marginTop: 12,
  textTransform: "unset",
  textDecoration: "underline",
  fontWeight: "normal",
  [theme.breakpoints.down("lg")]: {
    marginBottom: 30,
  },
  [theme.breakpoints.down("md")]: {
    marginBottom: 20,
  },
}));
