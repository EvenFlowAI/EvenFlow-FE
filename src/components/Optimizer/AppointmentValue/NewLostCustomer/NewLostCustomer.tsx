import React from "react";
import {AppointmentTable} from "../UI";
import {Button, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";

export const NewLostCustomer = () => {
    return <div>
        <AppointmentTable>
            <TableHead>
                <TableRow>
                    <TableCell colSpan={2}>Customer Type</TableCell>
                    <TableCell colSpan={2}>Time Period</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>New Customer</TableCell>
                    <TableCell>Considered new up to</TableCell>
                    <TableCell className="primary">8 months</TableCell>
                    <TableCell align="right"><Button color="primary">Edit</Button></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Lost Customer</TableCell>
                    <TableCell>Considered lost after</TableCell>
                    <TableCell className="primary">24 months</TableCell>
                    <TableCell align="right"><Button color="primary">Edit</Button></TableCell>
                </TableRow>
            </TableBody>
        </AppointmentTable>
    </div>;
}