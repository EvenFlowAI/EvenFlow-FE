import React from "react";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import {MonthSelectorWrapper} from "./styles";
import {TMonthProps} from "../types";
import dayjs from "dayjs";

export const MonthSelector: React.FC<React.PropsWithChildren<React.PropsWithChildren<TMonthProps>>> = ({date, onDateChange, loading}) => {
    const handleNext = () => {
        onDateChange(dayjs.utc(date).startOf('month').add(1, 'month'));
    }
    const handlePrevious = () => {
        onDateChange(dayjs.utc(date).startOf('month').subtract(1, 'month'));
    }
    return <MonthSelectorWrapper>
        <div onClick={handlePrevious}>
            <ChevronLeft/>
        </div>
        <div className={"month"}>
            {dayjs.utc(date).format('MMM, YYYY')}
        </div>
        <div onClick={handleNext}>
            <ChevronRight/>
        </div>
    </MonthSelectorWrapper>
}