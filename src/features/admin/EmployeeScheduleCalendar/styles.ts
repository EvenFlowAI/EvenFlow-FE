import { styled, Table, TableCell } from "@mui/material";

import { withStyles } from 'tss-react/mui';

export const ControlWrapper = styled("div")(({theme}) => ({
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "flex-end",
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
        justifyContent: "center"
    }
}));

export const nonWorkingStyle = {
    background: `repeating-linear-gradient(
        45deg,
        #ffffff,
        #ffffff 2px,
        #F7F8FB 2px,
        #F7F8FB 4px
    )`,
    cursor: "default"
};

export const Holiday = styled("div")(({theme}) => ({
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 2,
    color: "#fff",
    textOverflow: "ellipsis",
    overflow: "auto",
    textAlign: "center",
    padding: "0 4px",
    maxWidth: "100%",
}));

export const HeadCell = styled(TableCell)(({theme}) => ({
    width: "12%",
    maxWidth: 0,
    overflow: "hidden",
    verticalAlign: "bottom",
    "&>.content": {
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        maxWidth: "100%"
    },
    [theme.breakpoints.down('sm')]: {
        width: "35%"
    }
}));

export const ScheduleTable = withStyles(Table, {
    root: {
        "& .MuiTableCell-head": {
            textTransform: "uppercase",
            fontSize: 12,
            fontWeight: "bold",
            color: "#9FA2B4",
        },
        "& .MuiTableCell-root": {
            borderBottom: "none",
            borderRight: `1px solid #E0E2E8`
        },
        "& .MuiTableCell-root:last-child, & .MuiTableCell-head": {
            borderRight: "none"
        },
        "& .MuiTableRow-root .MuiTableCell-body": {
            backgroundColor: "#fff"
        },
        "& .MuiTableRow-root:nth-child(2n) .MuiTableCell-body": {
            backgroundColor: "#F2F3F7"
        }
    }
});