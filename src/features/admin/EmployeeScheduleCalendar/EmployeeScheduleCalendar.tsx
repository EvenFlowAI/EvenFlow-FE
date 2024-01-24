import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {findScheduleDates, getDaysOfWeek, getSchedule} from "./utils";
import {
    CircularProgress,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    useMediaQuery, useTheme
} from "@mui/material";
import moment, {Moment} from "moment";
import {WeekControls} from "./WeekControls/WeekControls";
import {useDispatch, useSelector} from "react-redux";
import {loadEmployeesSchedule} from "../../../store/reducers/schedules/actions";
import {RootState} from "../../../store/rootReducer";
import {NameCell} from "./NameCell/NameCell";
import {IEmployee} from "../../../store/reducers/employees/types";
import {ISchedule} from "../../../store/reducers/schedules/types";
import {EditScheduleModal} from "./EditScheduleModal/EditScheduleModal";
import {ScheduleFilters} from "./ScheduleFilters/ScheduleFilters";
import {loadWorkingDays} from "../../../store/reducers/serviceCenters/actions";
import {EDay} from "../../../store/reducers/demandSegments/types";
import {getStartEndDates, noop} from "../../../utils/utils";
import {loadWeeklyHolidaysList} from "../../../store/reducers/holidays/actions";
import { TIds } from './types';
import {ControlWrapper, HeadCell, Holiday, nonWorkingStyle, ScheduleTable} from "./styles";
import {calendarDateFormat} from "../../../utils/constants";
import {useModal} from "../../../hooks/useModal/useModal";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import dayjs from "dayjs";

export const EmployeeScheduleCalendar = () => {
    const {
        employeesList,
        employeesLoading,
        filters,
    } = useSelector(({employeesSchedule}: RootState) => employeesSchedule)
    const {workingDays} = useSelector(({serviceCenters}: RootState) => serviceCenters)
    const {weeklyHolidaysList} = useSelector(({holidays}: RootState) => holidays)

    const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
    const [editedDate, setEditedDate] = useState<moment.Moment>(moment());
    const [editedEmployee, setEditedEmployee] = useState<IEmployee>({} as IEmployee);
    const [editedSchedule, setEditedSchedule] = useState<ISchedule|undefined>(undefined);
    const [ids, setIds] = useState<TIds>({});

    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const {isOpen, onOpen, onClose} = useModal();
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down('sm'));
    const [start, end] = useMemo(() => getStartEndDates(selectedDate, isXS), [selectedDate, isXS, selectedSC])
    const daysOfWeek = useMemo(() => getDaysOfWeek(selectedDate, isXS), [selectedDate, isXS, selectedSC]);

    useEffect(() => {
        if (selectedSC) {
            if (start && end) dispatch(loadEmployeesSchedule(start, end, selectedSC.id));
        }
    }, [dispatch, selectedSC, selectedDate, filters, isXS, start, end]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadWorkingDays(selectedSC.id));
            dispatch(loadWeeklyHolidaysList(daysOfWeek[0].toISOString(), daysOfWeek[daysOfWeek.length-1].toISOString()));
        }
    }, [daysOfWeek, selectedSC]);

    const handleChange = (date: moment.Moment) => {
        setSelectedDate(date);
    }

    const handleRefresh = useCallback((clearId?: keyof TIds) => {
        if (clearId) {
            setIds({...ids, [clearId]: undefined});
        }
        if (selectedSC) {
            const [start, end] = getStartEndDates(selectedDate, isXS);
            dispatch(loadEmployeesSchedule(start, end, selectedSC.id));
        }
    }, [setIds, ids, selectedSC, getStartEndDates, selectedDate, isXS, dispatch, loadEmployeesSchedule])

    const updateEditedEmployee = async (id: string) => {
        try {
            const {data} = await Api.call<IEmployee>(Api.endpoints.Users.Retrieve, {urlParams: {id}});
            setEditedEmployee(data);
        } catch (e) {
            console.error(e);
        }
    }

    const getIds = useCallback((date: moment.Moment, schedules: ISchedule[]): TIds => {
        const data = schedules.filter(s => s.dayOfWeek === moment(date).day());
        return {
            customId: data.find(s => !s.isRecurring)?.id,
            recursiveId: data.find(s => s.isRecurring)?.id
        }
    }, [])

    const handleEdit = useCallback((employee: IEmployee, date: moment.Moment, schedules?: ISchedule[]) => async () => {
        setEditedDate(date);
        setEditedEmployee({...employee, serviceCenter: selectedSC});
        setIds(getIds(date, schedules||[]));
        await updateEditedEmployee(employee.id);
        setEditedSchedule(getSchedule(date, schedules||[]));
        onOpen();
    }, [getIds, updateEditedEmployee, getSchedule, onOpen])

    const getCellStyle = (nonWorking: boolean) => nonWorking ? nonWorkingStyle : {};

    const getHoliday = useCallback((date: moment.Moment) => {
        const holiday = weeklyHolidaysList.find(h => {
            const d = dayjs.utc(h.date).year(date.year()).startOf('day');
            return dayjs(dayjs(d).format("YYYY-MM-DD"), "YYYY-MM-DD")
                .isSame(dayjs(dayjs.utc(date.toDate()).format("YYYY-MM-DD"), "YYYY-MM-DD"), "date");
        });
        if (holiday) {
            const description = holiday.description?.length > 40
                ? holiday.description.slice(0, 39).concat('...')
                : holiday.description
            return <Tooltip title={holiday.description}><Holiday>{description}</Holiday></Tooltip>;
        }
        return null;
    }, [weeklyHolidaysList])

    const isWorkingDay = useCallback((date: Moment): boolean => {
        const holiday = weeklyHolidaysList.find(h => {
            const d = dayjs.utc(h.date).year(date.year()).startOf('day');
            return d.isSame(dayjs.utc(date.toDate()), "date");
        });
        return workingDays.includes(moment.utc(date).day() as EDay) && !holiday;
    }, [workingDays, weeklyHolidaysList])

    return (
        <div>
            <ControlWrapper>
                <ScheduleFilters/>
                <WeekControls
                    isXS={isXS}
                    selectedDate={selectedDate}
                    onChange={handleChange}
                />
            </ControlWrapper>
            <ScheduleTable>
                <TableHead>
                    <TableRow>
                        <TableCell style={{verticalAlign: "bottom"}}>Employees</TableCell>
                        {daysOfWeek.map((date) => {
                            return <HeadCell key={date.toISOString()}>
                                <div className="content">
                                    {getHoliday(date)}
                                    <span>{date.format(calendarDateFormat)}</span>
                                </div>
                            </HeadCell>
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(employeesLoading || !employeesList.length) ?
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                {employeesLoading ? <CircularProgress /> : <span>No employees</span>}
                            </TableCell>
                        </TableRow> :
                        employeesList.map(({employee, schedules}) => {
                            return <TableRow key={employee.id}>
                                <TableCell>
                                    <NameCell employee={employee} />
                                </TableCell>
                                {daysOfWeek.map((date) => {
                                    return <TableCell
                                        key={date.toISOString()}
                                        onClick={isWorkingDay(date) ? handleEdit(employee, date, schedules) : noop}
                                        style={{
                                            cursor: "pointer",
                                            fontSize: isXS ? 12 : 13,
                                            ...getCellStyle(!isWorkingDay(date))
                                        }}>
                                        {findScheduleDates(date, schedules, isWorkingDay(date))}
                                    </TableCell>
                                })}
                            </TableRow>
                        })
                    }
                </TableBody>
            </ScheduleTable>
            <EditScheduleModal
                selectedDate={selectedDate}
                date={editedDate}
                employee={editedEmployee}
                onEmployeeUpdate={updateEditedEmployee}
                open={isOpen}
                onClear={handleRefresh}
                payload={editedSchedule}
                recursiveId={ids.recursiveId}
                customId={ids.customId}
                onClose={onClose} />
        </div>
    );
};