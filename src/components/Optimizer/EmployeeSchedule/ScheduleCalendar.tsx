import React, {useEffect, useMemo, useState} from 'react';
import {calendarDateFormat, findScheduleDates, getDaysOfWeek, getSchedule, getStartEndDates} from "./utils";
import {ScheduleTable} from "./UI";
import {CircularProgress, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import moment from "moment";
import {WeekControls} from "./WeekControls";
import {useModal, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadEmployeesSchedule} from "../../../store/reducers/schedules/actions";
import {RootState} from "../../../store/rootReducer";
import {NameCell} from "./NameCell";
import {IEmployee} from "../../../store/reducers/employees/types";
import {ISchedule} from "../../../store/reducers/schedules/types";
import {EditSchedule} from "./EditSchedule";
import {ScheduleFilters} from "./ScheduleFilters";
import { OpenedFilters } from './OpenedFilters';
import {Api} from "../../../config/requests";

const controlStyles = {
    display: "flex", flexFlow: "row nowrap", justifyContent: "flex-end",
    marginBottom: 10
}

export const ScheduleCalendar = () => {
    const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
    const [editedDate, setEditedDate] = useState<moment.Moment>(moment());
    const [editedEmployee, setEditedEmployee] = useState<IEmployee>({} as IEmployee);
    const [editedSchedule, setEditedSchedule] = useState<ISchedule|undefined>(undefined);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const [employeesList, employeesLoading, filtersOpened, filters] = useSelector((state: RootState) => [
        state.employeesSchedule.employeesList,
        state.employeesSchedule.employeesLoading,
        state.employeesSchedule.filtersOpened,
        state.employeesSchedule.filters
    ]);
    const {isOpen, onOpen, onClose} = useModal();

    // const now = moment();
    const daysOfWeek = useMemo(() => getDaysOfWeek(selectedDate), [selectedDate]);

    useEffect(() => {
        if (selectedSC) {
            const [start, end] = getStartEndDates(selectedDate);
            dispatch(loadEmployeesSchedule(start, end, selectedSC.id));
        }
    }, [dispatch, selectedSC, selectedDate, filters]);

    const handleChange = (date: moment.Moment) => {
        setSelectedDate(date);
    }

    const updateEditedEmployee = async (id: string) => {
        try {
            const {data} = await Api.call<IEmployee>(Api.endpoints.Users.Retrieve, {urlParams: {id}});
            setEditedEmployee(data);
        } catch (e) {
            console.error(e);
        }
    }

    const handleEdit = (employee: IEmployee, date: moment.Moment, schedules?: ISchedule[]) => async () => {
        setEditedDate(date);
        setEditedEmployee({...employee, serviceCenter: selectedSC});
        await updateEditedEmployee(employee.id);
        setEditedSchedule(getSchedule(date, schedules||[]));
        onOpen();
    }

    return (
        <div>
            <div>
                {filtersOpened ? <ScheduleFilters /> : <OpenedFilters />}
            </div>
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
                                    <NameCell employee={employee} />
                                </TableCell>
                                {daysOfWeek.map(date => {
                                    return <TableCell
                                        key={date.toISOString()}
                                        onClick={handleEdit(employee, date, schedules)}
                                        style={{cursor: "pointer", fontSize: 13}}>
                                        {findScheduleDates(date, schedules)}
                                    </TableCell>
                                })}
                            </TableRow>
                        })
                    }
                </TableBody>
            </ScheduleTable>
            <EditSchedule
                date={editedDate}
                employee={editedEmployee}
                onEmployeeUpdate={updateEditedEmployee}
                open={isOpen}
                payload={editedSchedule}
                onClose={onClose} />
        </div>
    );
};