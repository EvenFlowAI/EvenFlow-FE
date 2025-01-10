import { FormControlLabel, styled, FormControlLabelProps } from "@mui/material";
import { TextField } from "../../../../../components/styled/EndUserInputs";

export const Wrapper = styled("div")({
  width: "100%",
});

export const SearchInput = styled(TextField)({
  "& button": {
    marginLeft: 6,
  },
});

export const CodesWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginTop: 20,
});

export const CodeWrapper = styled("div")({
  border: "1px solid #DADADA",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const Price = styled("span")({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  fontSize: 18,
  fontWeight: "bold",
});

export const PricesWrapper = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingRight: 8,
});

const OfferPrice = styled("div")({
  display: "flex",
  flexWrap: "nowrap",
  justifyContent: "space-between",
  alignItems: "center",
  marginRight: 28,
  fontSize: 14,
  color: "#008331",
});

export const Code = styled(FormControlLabel)<FormControlLabelProps>({
  width: "80%",
  padding: 0,
  margin: 0,
  textTransform: "uppercase",
  display: "flex",
  "& span": {
    fontSize: 14,
    "&:last-child": {
      padding: "8px 8px 8px 0",
    },
  },
});
