import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle, TableContainer} from "../UI";
import {Divider, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {DemandTable} from "../../AppointmentAllocation/UI";

const useStyles = makeStyles({

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
                        <TableCell>Window 1</TableCell>
                        <TableCell>Window 2</TableCell>
                        <TableCell>Window 3</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Start (hours)</TableCell>
                        <TableCell>Duration (hours)</TableCell>
                        <TableCell>Eligibility Status</TableCell>
                    </TableRow>
                </TableBody>
            </DemandTable>
        </TableContainer>
    </SquarePaper>
};