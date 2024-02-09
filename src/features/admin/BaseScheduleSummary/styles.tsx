import {styled, TableCell, TableRow} from "@mui/material";

export const StyledCell = styled(TableCell)({
    borderBottom: "none",
    fontSize: 16,
})

export const TableTitleWrapper = styled("div")({
    padding: 16,
})

export const TableTitle = styled("h4")({
    fontWeight: 400,
    margin: 0,
    fontSize: 18
})

export const TableHeaderRow = styled(TableRow)({
    borderBottom: '1px solid #DADADA',
    borderTop: '1px solid #DADADA'
})

export const TableFooterRow = styled(TableRow)({
    borderTop: '1px solid #858585'
})

export const TableTotalCell = styled(StyledCell)({
    fontWeight: 'bold',
    color: "#252733"
})

export const TableHeaderCell = styled(StyledCell)({
    color: "#252733",
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "bold",
})

export const DayNameCell = styled(StyledCell)({
    color: "#858585",
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 12,
})