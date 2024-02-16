import React, {useEffect, useState} from "react";
import {TParsableDate} from "../../../types/types";
import dayjs from "dayjs";
import {ReactComponent as Star} from "../../../assets/img/star.svg";
import {ReactComponent as User} from "../../../assets/img/persons.svg";
import {DataCalendar} from "../../../components/DataCalendar/DataCalendar";

type TData = {
    date: TParsableDate;
    techniciansAmount: number;
    advisorsAmount: number;
}

export const AvailableStaffCalendar = () => {
    const [date, setDate] = useState<TParsableDate>(dayjs());
    const [data, setData] = useState<TData[]>([]);

    useEffect(() => {
        const dates = []
        let today = dayjs()
        for (let i = 1; i < 60; i++) {
            dates.push(today)
            today = today.add(1, 'day');
        }
        setData(dates.map(date => ({
            date,
            techniciansAmount: 8,
            advisorsAmount: 5
        })))
    }, [])

    const onDayClick = (el: TData|undefined) => {
    }

    return <DataCalendar
        data={data}
        firstIcon={<User/>}
        secondIcon={<Star />}
        firstIconFieldName={'techniciansAmount'}
        secondIconFieldName={'advisorsAmount'}
        date={date}
        setDate={setDate}
        dateFieldName={'date'}
        onDayClick={onDayClick}/>
}