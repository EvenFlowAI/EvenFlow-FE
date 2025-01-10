import { Button as DefaultButton, styled, TableCell } from "@mui/material";
import { withStyles } from "tss-react/mui";

export const TCell = styled(TableCell)({
  padding: "12px 16px !important",
});

export const SliderCell = styled(TableCell)(({ theme }) => ({
  padding: "12px 18px !important",
  [theme.breakpoints.down("sm")]: {
    padding: `${theme.spacing(2)} ${theme.spacing(2)} !important`,
  },
}));

export const Button = withStyles(DefaultButton, (theme) => ({
  root: {
    fontSize: 14,
    textTransform: "none",
    minWidth: 0,
    padding: "4px 2px",
    marginLeft: 8,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
    },
  },
}));
