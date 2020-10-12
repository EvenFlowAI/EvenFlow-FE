import React from "react";
import {AppointmentTable} from "../AppointmentValue/UI";
import {TableBody, TableCell as TC, TableRow, withStyles} from "@material-ui/core";

const TableCell = withStyles({
    root: {
        padding: "12px 16px !important",
        textAlign: "center",
    }
})(TC);

const theadStyle = {
    fontWeight: "bold" as const, textTransform: "uppercase" as const
};

export const ScheduledAppointments = () => {
    return <div>
        <AppointmentTable>
            <TableBody>
                <TableRow>
                    <TableCell style={theadStyle}>Time windows</TableCell>
                    <TableCell style={theadStyle}>Window 1</TableCell>
                    <TableCell style={theadStyle}>Window 2</TableCell>
                    <TableCell style={theadStyle}>Window 3</TableCell>
                    <TableCell rowSpan={3} />
                </TableRow>
                <TableRow>
                    <TableCell>Start (hours)</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                </TableRow>
                <TableRow>
                    <TableCell>Duration (hours)</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                </TableRow>
            </TableBody>
        </AppointmentTable>
    </div>
}