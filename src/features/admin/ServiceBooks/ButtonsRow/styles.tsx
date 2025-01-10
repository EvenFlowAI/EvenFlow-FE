import { styled } from "@mui/material";

export const Wrapper = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
});

export const Definition = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  fontWeight: 700,
  fontSize: 14,
  "& .title": {
    textTransform: "uppercase",
    marginRight: 16,
  },
  " .checkmark": {
    marginRight: 8,
  },
  " .checkmarkLabel": {
    marginRight: 24,
  },
});

export const ButtonsWrapper = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  "& > button:first-child": {
    marginRight: 20,
  },
});
