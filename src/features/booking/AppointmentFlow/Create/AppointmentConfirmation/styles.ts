import { styled } from "@mui/material";

export const Wrapper = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 80,
  "&>div": {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  "& > .itemizedLink": {
    textDecoration: "underline",
    textTransform: "none",
  },
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
    gap: "20px",
  },
}));

export const Info = styled("div")({
  fontSize: 12,
  color: "#828282",
});
