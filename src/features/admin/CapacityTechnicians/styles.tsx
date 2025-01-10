import { styled } from "@mui/material";

export const RadioBlock = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  marginBottom: -24,
  "& .MuiFormControlLabel-label": {
    fontWeight: 700,
    fontSize: 14,
  },
});

export const RadioGroupLabel = styled("div")({
  fontSize: 14,
  fontWeight: 700,
  textTransform: "uppercase",
  marginRight: 24,
});
