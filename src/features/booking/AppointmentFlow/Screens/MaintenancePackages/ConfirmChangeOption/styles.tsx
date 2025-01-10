import { styled } from "@mui/material";
import { BfButtonsWrapper } from "../../../../../../components/styled/BfButtonsWrapper";

export const BtnsWrapper = styled(BfButtonsWrapper)(({ theme }) => ({
  [theme.breakpoints.down("mdl")]: {
    flexDirection: "column-reverse",
    "& > div:last-child, & > button:last-child": {
      marginBottom: 12,
      marginRight: 0,
    },
  },
}));
