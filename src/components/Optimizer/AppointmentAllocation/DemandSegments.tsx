import React from "react";
import {TableCell, TableHead, TableRow, TableBody, Button} from "@material-ui/core";
import {AppointmentTable} from "../AppointmentValue/UI";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    cell: {
        border: "none !important",
        padding: "12px 16px !important",
        textAlign: "center",
    },
    table: {
        border: `1px solid ${theme.palette.divider}`
    },
    row: {
        "&:nth-child(2n) .MuiTableCell-root": {
            backgroundColor: "#F2F3F7"
        }
    },
    headRow: {
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    button: {
        textTransform: "none",
        fontSize: 16
    }
}));

export const DemandSegments = () => {
    const classes = useStyles();
    return <AppointmentTable className={classes.table}>
        <TableHead>
            <TableRow className={classes.headRow}>
                <TableCell className={classes.cell}>Demand segments</TableCell>
                <TableCell className={classes.cell}>Window 1</TableCell>
                <TableCell className={classes.cell}>Window 2</TableCell>
                <TableCell className={classes.cell}>Window 3</TableCell>
                <TableCell className={classes.cell} width={100}>
                    <Button
                        className={classes.button}
                        color='primary'>
                        Edit
                    </Button>
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            <TableRow className={classes.row}>
                <TableCell className={classes.cell}>1</TableCell>
                <TableCell className={classes.cell}>1</TableCell>
                <TableCell className={classes.cell}>1</TableCell>
                <TableCell className={classes.cell}>1</TableCell>
                <TableCell className={classes.cell} />
            </TableRow>
            <TableRow className={classes.row}>
                <TableCell className={classes.cell}>1</TableCell>
                <TableCell className={classes.cell}>1</TableCell>
                <TableCell className={classes.cell}>1</TableCell>
                <TableCell className={classes.cell}>1</TableCell>
                <TableCell className={classes.cell} />
            </TableRow>
            <TableRow className={classes.row}>
                <TableCell className={classes.cell}>1</TableCell>
                <TableCell className={classes.cell}>1</TableCell>
                <TableCell className={classes.cell}>1</TableCell>
                <TableCell className={classes.cell}>1</TableCell>
                <TableCell className={classes.cell} />
            </TableRow>
        </TableBody>
    </AppointmentTable>;
}