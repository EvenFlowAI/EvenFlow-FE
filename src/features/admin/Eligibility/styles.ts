import {styled} from "@mui/material";

export const headCellStyles = {
    fontSize: 12,
    lineHeight: "16px",
    color: "#9FA2B4"
}
export const leftAlign = {
    textAlign: "left" as const
}

export const TableWrapper = styled("div")(({theme}) => ({
    width: "100%",
    overflowX: "auto",
    "& .MuiTableCell-root": {
        [theme.breakpoints.down('sm')]: {
            fontSize: "10px !important",
            padding: "6px !important"
        }
    }
}))
