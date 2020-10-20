import React from 'react';
import {calendarDateFormat, getDaysOfWeek} from "./utils";
import {ScheduleTable} from "./UI";
import {TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import moment from "moment";
export const ScheduleCalendar = () => {
    const now = moment();
    const daysOfWeek = getDaysOfWeek(now);

    return (
        <div>
            <ScheduleTable>
                <TableHead>
                    <TableRow>
                        <TableCell>Employees</TableCell>
                        {daysOfWeek.map(date => {
                            return <TableCell key={date.toISOString()}>
                                {date.format(calendarDateFormat)}
                            </TableCell>
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[...Array(3)].map((_,idx) => {
                        return <TableRow key={idx}>
                            <TableCell>1</TableCell>
                            <TableCell>2</TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>4</TableCell>
                            <TableCell>5</TableCell>
                            <TableCell>6</TableCell>
                            <TableCell>7</TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </ScheduleTable>
        </div>
    );
};