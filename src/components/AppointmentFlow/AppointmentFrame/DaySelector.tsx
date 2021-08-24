import React, {useEffect, useMemo, useRef, useState} from 'react';
import moment from "moment";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {DaySelectCard} from "./DaySelectCard";
import {TArgCallback} from "../../../types/types";
import {styled, Theme} from "@material-ui/core";
import {TGroupedAppointments} from "../../../utils/types";

const DaySelectorWrapper = styled('div')({
    marginTop: 20,
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
    flexShrink: 0,
    opacity: ({disabled}) => disabled ? .5 : 1,
    display: "flex",
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    cursor: ({disabled}) => disabled ? "default" : "pointer",
});


const getDate = (date: moment.Moment, d: number) => {
    return moment.utc(date).date(d).startOf('day').toISOString().replace('.000', '');
}


type TProps = {
    date: moment.Moment,
    onDateChange: TArgCallback<moment.Moment>;
    loading: boolean;
    appointments: TGroupedAppointments;
}
export const DaySelector: React.FC<TProps> = ({date, onDateChange, loading, appointments}) => {
    const [sliceIdx, setSliceIdx] = useState<number>(0);
    const daysPerScreen: number = useMemo(() => {
        return 6;
    }, []);

    const initRef = useRef<boolean>(false);

    const [daysInMonth, days]: [number, string[]] = useMemo(() => {
        const dim = date.daysInMonth();
        return [
            dim,
            Array(dim).fill(0).map((e, idx) => getDate(date, idx+1))
        ];
    }, [date]);

    useEffect(() => {
        if (!initRef.current) {
            const nD = date.date() - Math.floor(daysPerScreen / 2);
            if (nD + daysPerScreen > daysInMonth) {
                // Handle right date edge
                setSliceIdx(daysInMonth - daysPerScreen);
            } else {
                // Handle left date edge
                setSliceIdx(nD >= 0 ? nD : 0);
            }
            initRef.current = true;
        }
    }, [date, daysPerScreen, daysInMonth]);

    const handleChangeDay = (date: string) => () => {
        onDateChange(moment.utc(date));
    }

    const nextAvailable = (): boolean => {
        return (sliceIdx + daysPerScreen) < daysInMonth;
    }
    const prevAvailable = (): boolean => {
        return sliceIdx > 0;
    }
    const handleNext = () => {
        if (nextAvailable()) {
            setSliceIdx(s => {
                const nS = s + (daysPerScreen * 2);
                return nS <= daysInMonth ? s + daysPerScreen : daysInMonth - daysPerScreen;
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
                <DaySelectCard
                    key={day}
                    isCurrent={date.isSame(moment.utc(day), 'date')}
                    appointment={appointments[day]}
                    onClick={handleChangeDay(day)}
                    day={day}
                />
        )}
        <Arrow onClick={handleNext} disabled={!nextAvailable()}>
            <ChevronRight />
        </Arrow>
    </DaySelectorWrapper>
}