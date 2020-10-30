import React from 'react';
import {Button, Paper, TableCell, TableHead, TableRow} from "@material-ui/core";
import {AppointmentTable} from "../AppointmentValue/UI";
import {makeStyles} from "@material-ui/core/styles";
import {useModal} from "../../../utils/hooks";
import { EditDemandSegments } from './EditDemandSegments';

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
    },
    edit: {
        fontSize: 14,
        textTransform: "none",
        padding: 5,
        position: "absolute",
        top: "50%",
        transform: "translate(0, -50%)",
        right: 0
    },
    buttonCell: {
        position: "relative",
        paddingRight: "56px !important"
    }
});

export const DemandSegmentsDesirability = () => {
    const {onOpen, onClose, isOpen} = useModal();

    const handleOpen = () => {
        onOpen();
    }
    const classes = useStyles();
    return <Paper variant="outlined" style={{borderRadius: 0}}>
        <AppointmentTable className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell className={classes.buttonCell} colSpan={2}>
                        Demand Segment
                        <Button className={classes.edit} onClick={handleOpen} color="primary">Edit</Button>
                    </TableCell>
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
        <EditDemandSegments onClose={onClose} open={isOpen} />
    </Paper>
};