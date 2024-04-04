import {styled, TableCell} from "@mui/material";

export const TableWrapper = styled("div")(({theme}) => ({
    "& .MuiTableCell-root": {
        textTransform: 'none',
        padding: '8px 16px !important',
        [theme.breakpoints.down('sm')]: {
            fontSize: "10px !important",
            padding: "6px !important"
        }
    }
}))

export const HeaderCell = styled(TableCell)({
    fontSize: 16,
})

export const headCellStyles = {

}