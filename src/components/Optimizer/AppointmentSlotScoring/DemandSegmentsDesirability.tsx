import React from 'react';
import {Paper, TableCell, TableHead, TableRow} from "@material-ui/core";
import {AppointmentTable} from "../AppointmentValue/UI";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    table: {
        "& .MuiTableCell-head": {
            textAlign: "center"
        }
    },
    subtitleCell: {
        padding: "8px !important",
        fontSize: "12px !important",
        color: "#9FA2B4"
    }
});

export const DemandSegmentsDesirability = () => {
    const classes = useStyles();
    return <Paper variant="outlined" style={{borderRadius: 0}}>
        <AppointmentTable className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell colSpan={2}>Demand Segment</TableCell>
                    <TableCell width={183} rowSpan={2}>Time Windows</TableCell>
                    <TableCell width={550} colSpan={2}>Optimization Settings</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className={classes.subtitleCell}>Segment Start</TableCell>
                    <TableCell className={classes.subtitleCell}>Segment End</TableCell>
                    <TableCell className={classes.subtitleCell}>Undesirable</TableCell>
                    <TableCell className={classes.subtitleCell}>Desirable</TableCell>
                </TableRow>
            </TableHead>
        </AppointmentTable>
    </Paper>
};