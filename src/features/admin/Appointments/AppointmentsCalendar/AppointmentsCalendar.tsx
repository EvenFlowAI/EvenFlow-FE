import React, {useEffect, useMemo, useState} from 'react';
import {IAppointmentsRequest} from "../../../../store/reducers/appointments/types";
import {loadAppointments} from "../../../../store/reducers/appointments/actions";
import {useDispatch, useSelector} from "react-redux";
import {TAppointmentsByDate, TDay, TView} from "../types";
import {RootState} from "../../../../store/rootReducer";
import {CalendarControls} from "../../AvailableStaffCalendar/CalendarControls/CalendarControls";
import {WeekDayNames} from "../../../../utils/constants";
import clsx from "clsx";
import {Paper} from '@mui/material';
import {ReactComponent as Active} from "../../../../assets/img/date_1.svg";
import {ReactComponent as FreeSlots} from "../../../../assets/img/date_2.svg";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {useStyles} from "./styles";
import {useCalendarStyles} from "../../../../hooks/styling/useCalendarStyles";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {TParsableDate} from "../../../../types/types";
import dayjs from "dayjs";

type TCalendarProps = {
    selectedView: TView;
    openDetails: (date: TParsableDate) => void;
}

export const AppointmentsCalendar: React.FC<React.PropsWithChildren<React.PropsWithChildren<TCalendarProps>>> = ({ openDetails, selectedView }) => {
    const { allAppointments, isLoading } = useSelector((state: RootState) => state.appointments);
    const [startDate, setStartDate] = useState<TParsableDate>(dayjs());
    const [appointmentsByDate, setAppointmentsByDate] = useState<TAppointmentsByDate>({})

    const calendarClasses = useCalendarStyles();
    const classes = useStyles();
    const dispatch = useDispatch();
    const {selectedSC}= useSCs();

    const today = useMemo(() => {
        return dayjs();
    }, []);

    const handleMonthChange = (m: TParsableDate) => {
        setStartDate(m);
    }

    const days: TDay[] = useMemo(() => {
        const days: TDay[] = [];
        let cur = dayjs(startDate).startOf("month");
        const daysInMonth = cur.daysInMonth();
        const startDay = cur.day();
        cur = cur.subtract(startDay, 'days');
        for (let i=0; i < daysInMonth + startDay; i++) {
            days.push({
                date: dayjs(cur),
                day: +cur.format("D"),
                type: cur.month() === dayjs(startDate).month() ? "cur" : "prev"
            });
            cur = cur.add(1, "day");
        }
        for (let i = 0; i < cur.day(); i++) {
            days.push({
                date: dayjs(cur),
                day: +cur.format("D"),
                type: "next"
            })
            cur = cur.add(1, "day");
        }

        return days;
    }, [startDate]);

    useEffect(() => {
        if (selectedSC && selectedView === "calendar") {
            const data: IAppointmentsRequest = {
                pageIndex: 0,
                pageSize: 0,
                serviceCenterId: selectedSC.id,
            }
            dispatch(loadAppointments(data));
        }
    }, [selectedSC, selectedView])

    useEffect(() => {
        setAppointmentsByDate(() => {
            const data: TAppointmentsByDate = {};
            allAppointments.forEach(item => {
                const dateString = dayjs.utc(item.dateTime).startOf('day').format('YYYY-MM-DD');
                data[dateString] = data[dateString] ? [...data[dateString], item] : [item];
            })
            return data
        })
    }, [allAppointments])

    return isLoading
        ? <Loading/>
        : <div style={{ width: '100%', padding: 20 }}>
            <Paper className={calendarClasses.paper} variant="outlined">
            <h2 className={calendarClasses.title}>Calendar</h2>
            <CalendarControls date={startDate} onChange={handleMonthChange} />
            <div className={calendarClasses.calendarWrapper}>
                {WeekDayNames.map(day =>
                    <div className={calendarClasses.weekDay} key={day}>{day}</div>
                )}
                {days.map(d =>{
                    const dateString = dayjs(d.date).startOf('day').format('YYYY-MM-DD');
                       return <div
                           onClick={() => openDetails(d.date)}
                            className={clsx(
                                calendarClasses.dayCell,
                                d.type === "cur"
                                    ? calendarClasses.currentMonth
                                    : calendarClasses.prevMonth,
                                dayjs(d.date).isSame(today, "day") ? calendarClasses.today : ""
                            )}
                            key={`${d.day}-${d.type}`}>
                            <span className={calendarClasses.dayNumber}>{d.day}</span>
                           <span className={clsx(calendarClasses.iconBlock, classes.number)}>
                                <Active/><span> - {appointmentsByDate[dateString]?.length || 0}</span>
                           </span>
                           <span className={clsx(calendarClasses.iconBlock, classes.number)}>
                               <FreeSlots /> <span> - 20</span>
                           </span>
                        </div>
                }
                )}
            </div>
        </Paper>
        </div>
};