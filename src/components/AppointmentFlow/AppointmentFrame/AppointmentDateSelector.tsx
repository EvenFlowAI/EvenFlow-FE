import React from 'react';
import {TArgCallback} from "../../../types/types";
import {styled} from "@material-ui/core";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import moment from "moment";
import {DaySelector} from "./DaySelector";
import {TGroupedAppointments} from "../../../utils/types";


const MonthSelectorWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    "&>div": {
        border: '1px solid #DADADA',
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 30,
        minWidth: 30,
        "&.month": {
            minWidth: 100,
            fontWeight: "bold",
            padding: "0 10px"
        }
    }
});



type TMonthProps = {
    date: moment.Moment,
    loading: boolean;
    onDateChange: TArgCallback<moment.Moment>;
}
type TProps = {
    appointments: TGroupedAppointments;
} & TMonthProps;

const MonthSelector: React.FC<TMonthProps> = ({date, onDateChange, loading}) => {
    const handleNext = () => {
        onDateChange(moment.utc(date).startOf('month').add(1, 'month'));
    }
    const handlePrevious = () => {
        onDateChange(moment.utc(date).startOf('month').subtract(1, 'month'));
    }
    return <MonthSelectorWrapper>
        <div onClick={handlePrevious}>
            <ChevronLeft />
        </div>
        <div className={"month"}>
            {date.format('MMM, YYYY')}
        </div>
        <div onClick={handleNext}>
            <ChevronRight />
        </div>
    </MonthSelectorWrapper>
}

export const AppointmentDateSelector: React.FC<TProps> = ({date, loading, onDateChange, appointments}) => {
    return (
        <div>
            <h4>Select Date</h4>
            <MonthSelector
                date={date}
                loading={loading}
                onDateChange={onDateChange} />
            <DaySelector
                date={date}
                appointments={appointments}
                loading={loading}
                onDateChange={onDateChange} />
        </div>
    );
};