import { Button, styled } from "@mui/material";

export const CarsWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  alignItems: "center",
  gap: "20px",
  justifyContent: "stretch",
  padding: "36px 48px",
  border: "2px solid #DADADA",
  borderRadius: 2,
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr 1fr",
    padding: "24px 16px",
    justifyContent: "space-around",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
    padding: "24px 16px",
    gap: "16px",
  },
}));

export const Info = styled("div")({
  fontSize: 18,
  "& span": {
    fontWeight: "bold",
    textDecoration: "underline",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "none",
    },
  },
});

export const ButtonsRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "22px",
  marginTop: 20,
  "& button": {
    minWidth: 144,
  },
  [theme.breakpoints.down("mdl")]: {
    position: "fixed",
    bottom: 0,
    left: 0,
    zIndex: 100,
    flexDirection: "column",
    width: "100%",
    gap: "12px",
    backgroundColor: "#F7F8FB",
    marginTop: 0,
    padding: "10px 20px",
    "& button": {
      width: "100%",
    },
  },
}));

export const NewVehicleBtn = styled(Button)({
  borderColor: "#DADADA",
  backgroundColor: "#FFFFFF",
});
