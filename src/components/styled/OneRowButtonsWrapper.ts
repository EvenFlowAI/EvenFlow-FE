import { styled } from "@mui/material";
import { BfButtonsWrapper } from "./BfButtonsWrapper";

export const OneRowButtonsWrapper = styled(BfButtonsWrapper)(({ theme }) => ({
  "& > div:first-child, & > button:first-child": {
    marginRight: 0,
    [theme.breakpoints.down("mdl")]: {
      marginBottom: 0,
    },
  },
  [theme.breakpoints.down("mdl")]: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: "16px !important",
    boxShadow: "0px -8px 20px 0px rgba(0, 0, 0, 0.10)",
    borderRadius: 4,
    "& div, & button": {
      width: 150,
    },
  },
}));
