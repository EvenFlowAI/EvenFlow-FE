import React, {useEffect, useMemo, useState} from 'react';
import {IAppointmentsRequest} from "../../store/reducers/appointments/types";
import {loadAppointments} from "../../store/reducers/appointments/actions";
import {useDispatch, useSelector} from "react-redux";
import {useSCs} from "../../utils/hooks";
import moment, {Moment} from "moment";
import {EAppointmentStatus, IListAppointment} from "../../api/types";
import {IOrder} from "../../types/types";
import {TView} from "./Appointments";
import {RootState} from "../../store/rootReducer";
import {useCalendarStyles} from "../Optimizer/CapacitySettings/AvailableStaff/Calendar";
import {CalendarControls} from "../Optimizer/CapacitySettings/AvailableStaff/CalendarControls";
import {WeekDayNames} from "../../config/constants";
import clsx from "clsx";
import {Paper} from '@material-ui/core';
import {ReactComponent as Active} from "../../assets/img/date_1.svg";
import {ReactComponent as FreeSlots} from "../../assets/img/date_2.svg";

type TCalendarProps = {
    date: moment.Moment | null;
    status: EAppointmentStatus | null | unknown;
    searchTerm: string;
    order: IOrder<IListAppointment>;
    selectedView: TView;
}

type TDayType = "prev" | "cur" | "next"

type TDay = {
    date: Moment,
    day: number,
    type: TDayType
}

type TAppointmentsByDate = {[key: string]: IListAppointment[]}

const AppointmentsCalendar: React.FC<TCalendarProps> = ({ order, date, status, searchTerm,selectedView }) => {
    const { appointments } = useSelector((state: RootState) => state.appointments);
    const [startDate, setStartDate] = useState<Moment>(moment());
    const [appointmentsByDate, setAppointmentsByDate] = useState<TAppointmentsByDate>({})
    const classes = useCalendarStyles();
    const dispatch = useDispatch();
    const {selectedSC}= useSCs();

    const today = useMemo(() => {
        return moment();
    }, []);

    const handleMonthChange = (m: Moment) => {
        setStartDate(m);
    }

    const days: TDay[] = useMemo(() => {
        const days: TDay[] = [];
        const cur = moment(date).startOf("month");
        const daysInMonth = cur.daysInMonth();
        const startDay = cur.day();
        cur.subtract(startDay, 'days');
        for (let i=0; i < daysInMonth + startDay; i++) {
            days.push({
                date: moment(cur),
                day: +cur.format("D"),
                type: cur.month() === startDate.month() ? "cur" : "prev"
            });
            cur.add(1, "day");
        }
        for (let i = 0; i < cur.day(); i++) {
            days.push({
                date: moment(cur),
                day: +cur.format("D"),
                type: "next"
            })
            cur.add(1, "day");
        }

        return days;
    }, [date]);

    useEffect(() => {
        if (selectedSC && selectedView === "calendar") {
            const data: IAppointmentsRequest = {
                pageIndex: 0,
                pageSize: 0,
                serviceCenterId: selectedSC.id,
                orderBy: order.orderBy,
                isAscending: order.isAscending,
                date,
                status,
                searchTerm,
            }
            dispatch(loadAppointments(data));
        }
    }, [selectedSC, order, date, status, searchTerm, selectedView])

    useEffect(() => {
        setAppointmentsByDate(() => {
            const data: TAppointmentsByDate = {};
            appointments.forEach(item => {
                data[item.dateInUtc as string] = data[item.dateInUtc as string] ? [...data[item.dateInUtc as string], item] : [item];
            })
            return data
        })
    }, [appointments])

    return (
        <Paper className={classes.paper} variant="outlined">
            <h2 className={classes.title}>Calendar</h2>
            <CalendarControls date={startDate} onChange={handleMonthChange} />
            <div className={classes.calendarWrapper}>
                {WeekDayNames.map(day =>
                    <div className={classes.weekDay} key={day}>{day}</div>
                )}
                {days.map(d =>{
                    const dateInUtc: string = moment(d.date).utc().toISOString();
                       return <div
                            className={clsx(
                                classes.dayCell,
                                d.type === "cur"
                                    ? d.date.isBefore(today, "day")
                                        ? classes.prevMonth
                                        : classes.currentMonth
                                    : classes.prevMonth,
                                d.date.isSame(today, "day") ? classes.today : ""
                            )}
                            key={`${d.day}-${d.type}`}>
                            <span className={classes.dayNumber}>{d.day}</span>
                            <span className={classes.iconBlock}><Active/> - {appointmentsByDate[dateInUtc]?.length || 0}</span>
                            <span className={classes.iconBlock}><FreeSlots /> - 2</span>
                        </div>
                }
                )}
            </div>
        </Paper>
    );
};

export default AppointmentsCalendar;