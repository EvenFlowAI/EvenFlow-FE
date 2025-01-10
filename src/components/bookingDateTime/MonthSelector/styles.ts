import { styled } from "@mui/material";

export const MonthSelectorWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  "&>div": {
    border: "1px solid #DADADA",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 30,
    minWidth: 30,
    "&.month": {
      minWidth: 100,
      fontWeight: "bold",
      padding: "0 10px",
    },
  },
});
