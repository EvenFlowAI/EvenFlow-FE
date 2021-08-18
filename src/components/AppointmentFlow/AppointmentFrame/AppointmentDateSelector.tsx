import React, {useMemo, useState} from 'react';
import {TArgCallback} from "../../../types/types";
import {styled, Theme} from "@material-ui/core";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import moment from "moment";


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


const DaySelectorWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "12px",
    width: "100%"
});
const Arrow = styled('div')<Theme, {disabled?: boolean}>({
    border: "1px solid #DADADA",
    width: 30,
    height: 30,
    flexGrow: 0,
    opacity: ({disabled}) => disabled ? .5 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: ({disabled}) => disabled ? "default" : "pointer",
});
const DayCard = styled('div')({
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    "& .day": {
        border: "1px solid #DADADA",
        padding: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    }
});


type TMonthProps = {
    date: moment.Moment,
    onDateChange: TArgCallback<moment.Moment>;
}

type TProps = {

} & TMonthProps;

const MonthSelector: React.FC<TMonthProps> = ({date, onDateChange}) => {
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

const DaySelector: React.FC<TMonthProps> = ({date, onDateChange}) => {
    const [sliceIdx, setSliceIdx] = useState<number>(0);
    const daysPerScreen: number = useMemo(() => {
        return 5;
    }, []);

    const [daysInMonth, days]: [number, number[]] = useMemo(() => {
        const dim = date.daysInMonth();
        return [
            dim,
            Array(dim).fill(0).map((e, idx) => idx + 1)
        ];
    }, [date]);

    const nextAvailable = (): boolean => {
        return (sliceIdx + daysPerScreen) < daysInMonth;
    }
    const prevAvailable = (): boolean => {
        return sliceIdx > 0;
    }
    const handleNext = () => {
        if (nextAvailable()) {
            setSliceIdx(s => {
                const nS = s + daysPerScreen;
                return nS <= daysInMonth ? nS : daysInMonth - daysPerScreen;
            });
        }
    }
    const handlePrev = () => {
        if (prevAvailable()) {
            setSliceIdx(s => {
                const pS = s - daysPerScreen;
                return pS >= 0 ? pS : 0;
            })
        }
    }
    return <DaySelectorWrapper>
        <Arrow onClick={handlePrev} disabled={!prevAvailable()}>
            <ChevronLeft  />
        </Arrow>
        {days
            .slice(sliceIdx, sliceIdx + daysPerScreen)
            .map(day =>
            <DayCard>
                <div>{day}</div>
                <div className="day">
                    Not Available
                </div>
            </DayCard>
        )}
        <Arrow onClick={handleNext} disabled={!nextAvailable()}>
            <ChevronRight />
        </Arrow>
    </DaySelectorWrapper>
}

export const AppointmentDateSelector: React.FC<TProps> = ({date, onDateChange}) => {
    return (
        <div>
            <h4>Select Date</h4>
            <MonthSelector date={date} onDateChange={onDateChange} />
            <DaySelector date={date} onDateChange={onDateChange} />
        </div>
    );
};