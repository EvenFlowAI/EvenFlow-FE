import { styled } from "@mui/material";
import { WrapperJustify } from "../../../components/styled/WrappersFlex";
import { makeStyles } from "tss-react/mui";

export const Wrapper = styled(WrapperJustify)({
  gap: 32,
  height: "100%",
  alignSelf: "center",
});

export const useAutocompleteStyles = makeStyles()(() => ({
  root: {
    "& > div > input": {
      padding: 7,
    },
  },
}));
