import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle, TableContainer} from "../UI";
import {Divider, Switch, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {DemandTable} from "../../AppointmentAllocation/UI";

const useStyles = makeStyles({
    switchCell: {
        fontSize: 12
    }
});

export const DemandWindows = () => {
    const classes = useStyles();
    return <SquarePaper variant="outlined">
        <PaperTitle>Demand windows Eligibility status</PaperTitle>
        <Divider />
        <TableContainer>
            <DemandTable>
                <TableHead>
                    <TableRow>
                        <TableCell>Time Windows</TableCell>
                        <TableCell align="center">Window 1</TableCell>
                        <TableCell align="center">Window 2</TableCell>
                        <TableCell align="center">Window 3</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Start (hours)</TableCell>
                        <TableCell align="center">0</TableCell>
                        <TableCell align="center">0</TableCell>
                        <TableCell align="center">0</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Duration (hours)</TableCell>
                        <TableCell align="center">0</TableCell>
                        <TableCell align="center">0</TableCell>
                        <TableCell align="center">0</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Eligibility Status</TableCell>
                        <TableCell className={classes.switchCell} align="center">
                            <strong>OFF</strong>
                            <Switch color="primary" />
                            <strong>ON</strong>
                        </TableCell>
                        <TableCell className={classes.switchCell} align="center">
                            <strong>OFF</strong>
                            <Switch color="primary" />
                            <strong>ON</strong>
                        </TableCell>
                        <TableCell className={classes.switchCell} align="center">
                            <strong>OFF</strong>
                            <Switch color="primary" />
                            <strong>ON</strong>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </DemandTable>
        </TableContainer>
    </SquarePaper>
};