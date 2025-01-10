import { TableCell } from "@mui/material";
import { styled } from "@mui/system";

interface OpCodeInterface {
  serviceValet: boolean;
}

export const TableWrapper = styled("div")(({ theme }) => ({
  "& .MuiTableCell-root": {
    textTransform: "none",
    padding: "8px 16px !important",
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px !important",
      padding: "6px !important",
    },
  },
}));

export const HeaderCell = styled(TableCell)({
  fontSize: 16,
});

export const headCellStyles = {};

export const OpCodeValue = styled("div")<OpCodeInterface>(
  ({ serviceValet }) => ({
    color: serviceValet ? "#7898FF" : "#000000",
    "&:hover": {
      cursor: serviceValet ? "pointer" : "default",
    },
  }),
);
