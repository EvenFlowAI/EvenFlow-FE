import React from "react";
import moment from "moment/moment";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {MonthSelectorWrapper} from "./styles";
import {TMonthProps} from "../types";

export const MonthSelector: React.FC<TMonthProps> = ({date, onDateChange, loading}) => {
    const handleNext = () => {
        onDateChange(moment.utc(date).startOf('month').add(1, 'month'));
    }
    const handlePrevious = () => {
        onDateChange(moment.utc(date).startOf('month').subtract(1, 'month'));
    }
    return <MonthSelectorWrapper>
        <div onClick={handlePrevious}>
            <ChevronLeft/>
        </div>
        <div className={"month"}>
            {date.format('MMM, YYYY')}
        </div>
        <div onClick={handleNext}>
            <ChevronRight/>
        </div>
    </MonthSelectorWrapper>
}