import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {calendarDateFormat, findScheduleDates, getDaysOfWeek, getSchedule, getStartEndDates} from "./utils";
import {ScheduleTable} from "./UI";
import {
    CircularProgress,
    styled,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    useMediaQuery, useTheme
} from "@material-ui/core";
import moment, {Moment} from "moment";
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
import {loadWorkingDays} from "../../../store/reducers/serviceCenters/actions";
import {EDay} from "../../../store/reducers/demandSegments/types";
import {noop} from "../../../utils/utils";
import {loadWeeklyHolidaysList} from "../../../store/reducers/holidays/actions";
import { TIds } from './types';


const ControlWrapper = styled("div")(({theme}) => ({
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "flex-end",
    marginBottom: 10,
    [theme.breakpoints.down("xs")]: {
        justifyContent: "center"
    }
}));

const nonWorkingStyle = {
    background: `repeating-linear-gradient(
        45deg,
        #ffffff,
        #ffffff 2px,
        #F7F8FB 2px,
        #F7F8FB 4px
    )`,
    cursor: "default"
};

const Holiday = styled("div")(({theme}) => ({
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 2,
    color: "#fff",
    textOverflow: "ellipsis",
    overflow: "auto",
    textAlign: "center",
    padding: "0 4px",
    maxWidth: "100%",
    // whiteSpace: "nowrap"
}));
const HeadCell = styled(TableCell)(({theme}) => ({
    width: "12%",
    maxWidth: 0,
    overflow: "hidden",
    verticalAlign: "bottom",
    "&>.content": {
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        maxWidth: "100%"
    },
    [theme.breakpoints.down("xs")]: {
        width: "35%"
    }
}));


export const ScheduleCalendar = () => {
    const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
    const [editedDate, setEditedDate] = useState<moment.Moment>(moment());
    const [editedEmployee, setEditedEmployee] = useState<IEmployee>({} as IEmployee);
    const [editedSchedule, setEditedSchedule] = useState<ISchedule|undefined>(undefined);
    const [ids, setIds] = useState<TIds>({});
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const [
        employeesList,
        employeesLoading,
        filtersOpened,
        filters,
        workingDays,
        holidaysList
    ] = useSelector((state: RootState) => [
        state.employeesSchedule.employeesList,
        state.employeesSchedule.employeesLoading,
        state.employeesSchedule.filtersOpened,
        state.employeesSchedule.filters,
        state.serviceCenters.workingDays,
        state.holidays.weeklyHolidaysList,
    ]);
    const {isOpen, onOpen, onClose} = useModal();
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    const [start, end] = useMemo(() => getStartEndDates(selectedDate, isXS), [selectedDate, isXS])

    const daysOfWeek = useMemo(() => getDaysOfWeek(selectedDate, isXS), [selectedDate, isXS]);

    useEffect(() => {
        if (selectedSC) {
            if (start && end) dispatch(loadEmployeesSchedule(start, end, selectedSC.id));
            dispatch(loadWorkingDays(selectedSC.id));
        }
    }, [dispatch, selectedSC, selectedDate, filters, isXS]);

    useEffect(() => {
        dispatch(loadWeeklyHolidaysList(daysOfWeek[0].toISOString(), daysOfWeek[daysOfWeek.length-1].toISOString()));
    }, [daysOfWeek, dispatch]);

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

    const getCellStyle = (nonWorking: boolean) => {
        return nonWorking ? nonWorkingStyle : {};
    }
    const getHoliday = useCallback((date: moment.Moment) => {
        const holiday = holidaysList.find(h => {
            const d = moment(h.date).year(date.year());
            return d.isSame(date, "date");
        });
        if (holiday) {
            return <Tooltip title={holiday.description}><Holiday>{holiday.description}</Holiday></Tooltip>;
        }
        return null;
    }, [holidaysList])

    const isWorkingDay = useCallback((date: Moment): boolean => {
        return workingDays.includes(date.day() as EDay)
        && !holidaysList.find(item => moment(item.date).isSame(date, 'date'))
    }, [workingDays, holidaysList])

    return (
        <div>
            <div>
                {filtersOpened ? <ScheduleFilters /> : <OpenedFilters />}
            </div>
            <ControlWrapper>
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
                            <TableCell colSpan={7} align="center">
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
            <EditSchedule
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