import { styled } from "@mui/material";

export const PickersWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 24,
  fontSize: 18,
  fontWeight: 700,
  [theme.breakpoints.down("xl")]: {
    gap: 8,
  },
}));
