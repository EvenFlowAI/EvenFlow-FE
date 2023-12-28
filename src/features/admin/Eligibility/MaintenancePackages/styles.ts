import {styled} from "@material-ui/core";

export const TableWrapper = styled("div")(({theme}) => ({
    width: "100%",
    overflowX: "auto",
    overflowY: "auto",
    maxHeight: "40vh",
    "& .MuiTableCell-root": {
        [theme.breakpoints.down("xs")]: {
            fontSize: "10px !important",
            padding: "6px !important"
        }
    }
}))