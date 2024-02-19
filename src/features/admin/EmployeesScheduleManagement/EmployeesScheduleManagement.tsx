import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {DataCalendar} from "../../../components/DataCalendar/DataCalendar";
import {ReactComponent as Hand} from "../../../assets/img/wrench_with_hand.svg";
import {ReactComponent as User} from "../../../assets/img/persons.svg";
import {ICalendarItem, TTimePeriod} from "../../../store/reducers/schedules/types";
import {TParsableDate} from "../../../types/types";
import dayjs from "dayjs";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {loadScheduleByDate, loadScheduleCalendar} from "../../../store/reducers/schedules/actions";

const initialPeriod = {
    startDate: null,
    endDate: null,
}

const EmployeesScheduleManagement = () => {
    const {calendarData} = useSelector((state: RootState) => state.employeesSchedule)
    const [date, setDate] = useState<TParsableDate>(dayjs());
    const [timePeriod, setTimePeriod] = useState<TTimePeriod>(initialPeriod);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC && timePeriod.startDate && timePeriod.endDate) {
            const utcOffset = dayjs().utcOffset()
            const start = dayjs(timePeriod.startDate).add(utcOffset, 'minute').startOf("day").toISOString()
            const end = dayjs(timePeriod.endDate).add(utcOffset, 'minute').startOf("day").toISOString()
            dispatch(loadScheduleCalendar(selectedSC.id, start, end))
        }
    }, [selectedSC, timePeriod])

    const onDayClick = (el: ICalendarItem|undefined) => {
        if (selectedSC && el) {
            const utcOffset = dayjs().utcOffset()
            dispatch(loadScheduleByDate(selectedSC.id, dayjs(el.date).add(utcOffset, 'minute').startOf("day").toISOString()))
        }
    }

    return <DataCalendar
        data={calendarData}
        firstIcon={<User/>}
        secondIcon={<Hand />}
        firstIconFieldName={'advisorsCount'}
        secondIconFieldName={'techniciansCount'}
        date={date}
        firstIconText={"The number of advisors scheduled for the day"}
        secondIconText={"The number of technicians scheduled for the day"}
        dateFieldName={'date'}
        setDate={setDate}
        setTimePeriod={setTimePeriod}
        onDayClick={onDayClick}/>
};

export default EmployeesScheduleManagement;