import { styled } from "@mui/material";

export const UpperLineContainer = styled("div")({
  width: "100%",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  paddingBottom: 24,
});

export const TableContainer = styled("div")({
  overflowX: "auto",
});

export const TableTitle = styled("div")({
  fontWeight: 700,
  fontSize: 18,
  textTransform: "uppercase",
});
