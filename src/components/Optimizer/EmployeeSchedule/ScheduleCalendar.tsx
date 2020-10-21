import React, {useEffect, useMemo, useState} from 'react';
import {calendarDateFormat, getDaysOfWeek, getStartEndDates} from "./utils";
import {ScheduleTable} from "./UI";
import {Avatar, CircularProgress, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import moment from "moment";
import {WeekControls} from "./WeekControls";
import {useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadEmployeesSchedule} from "../../../store/reducers/schedules/actions";
import {RootState} from "../../../store/rootReducer";
import {getInitials} from "../../../utils/utils";

const controlStyles = {
    display: "flex", flexFlow: "row nowrap", justifyContent: "flex-end",
    marginBottom: 10
}

export const ScheduleCalendar = () => {
    const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const [employeesList, employeesLoading] = useSelector((state: RootState) => [
        state.employeesSchedule.employeesList,
        state.employeesSchedule.employeesLoading
    ]);

    // const now = moment();
    const daysOfWeek = useMemo(() => getDaysOfWeek(selectedDate), [selectedDate]);

    useEffect(() => {
        if (selectedSC) {
            const [start, end] = getStartEndDates(selectedDate);
            dispatch(loadEmployeesSchedule(start, end, selectedSC.id));
        }
    }, [dispatch, selectedSC, selectedDate]);

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
                    {(employeesLoading || !employeesList.length) ?
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                {employeesLoading ? <CircularProgress /> : <span>No employees</span>}
                            </TableCell>
                        </TableRow> :
                        employeesList.map(({employee, schedules}) => {
                            return <TableRow key={employee.id}>
                                <TableCell>
                                    <Avatar>{employee.avatarPath || getInitials(employee.fullName)}</Avatar>
                                </TableCell>
                            </TableRow>
                        })
                    }
                </TableBody>
            </ScheduleTable>
        </div>
    );
};