import { styled } from "@mui/material";

export const SelectWrapper = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "20px",
  width: "100%",
  backgroundColor: "#828282",
  padding: 20,
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));
