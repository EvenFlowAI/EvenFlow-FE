import {styled} from "@mui/material";

export const TableWrapper = styled("div")(({theme}) => ({
    "& .MuiTableCell-root": {
        [theme.breakpoints.down('sm')]: {
            fontSize: "10px !important",
            padding: "6px !important"
        }
    }
}))

export const headCellStyles = {
    fontSize: 12,
    lineHeight: "16px",
    color: "#9FA2B4"
}