import React, {useState} from 'react';
import {calendarDateFormat, getDaysOfWeek} from "./utils";
import {ScheduleTable} from "./UI";
import {Avatar, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import moment from "moment";
import {WeekControls} from "./WeekControls";

const controlStyles = {
    display: "flex", flexFlow: "row nowrap", justifyContent: "flex-end",
    marginBottom: 10
}

export const ScheduleCalendar = () => {
    const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
    const now = moment();
    const daysOfWeek = getDaysOfWeek(now);

    const handleChange = (date: moment.Moment) => {
        setSelectedDate(date);
    }

    return (
        <div>
            <div style={controlStyles}>
                <WeekControls
                    selectedDate={selectedDate}
                    onChange={handleChange}
                />
            </div>
            <ScheduleTable>
                <TableHead>
                    <TableRow>
                        <TableCell>Employees</TableCell>
                        {daysOfWeek.map(date => {
                            return <TableCell width={"12%"} key={date.toISOString()}>
                                {date.format(calendarDateFormat)}
                            </TableCell>
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[...Array(3)].map((_,idx) => {
                        return <TableRow key={idx}>
                            <TableCell><Avatar>{idx}</Avatar></TableCell>
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