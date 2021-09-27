import React, {useEffect, useMemo, useState} from 'react';
import moment from "moment";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {DaySelectCard} from "./DaySelectCard";
import {TArgCallback} from "../../../types/types";
import {styled, Theme, useMediaQuery, useTheme} from "@material-ui/core";
import {TGroupedAppointments} from "../../../utils/types";
import {getAppointmentDate} from "./utils";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";

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

const WHILE_LIMIT = 40;
type TProps = {
    date: moment.Moment,
    dateRangeUpdated: boolean;
    onDateRangeSet: TArgCallback<boolean>;
    onDateChange: TArgCallback<moment.Moment>;
    loading: boolean;
    appointments: TGroupedAppointments;
}
export const DaySelector: React.FC<TProps> = ({date, onDateChange, loading, appointments, dateRangeUpdated, onDateRangeSet}) => {
    const [sliceIdx, setSliceIdx] = useState<number>(0);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const isXs = useMediaQuery(theme.breakpoints.down("xs"));
    const daysPerScreen: number = useMemo(() => {
        return isXs ? 5 : isSm ? 4 : 6;
    }, [isSm, isXs]);
    
    const selectedPackage = useSelector((state: RootState) => state.appointmentFrame.selectedPackage);
    const searchedDateRange = useSelector((state: RootState) => state.appointment.searchedDateRange);

    const [daysInMonth, days]: [number, string[]] = useMemo(() => {
        let dim: number = date.daysInMonth();
        let generatedDays: string[] = [];
        if (searchedDateRange) {
            dim = Math.abs(moment.utc(searchedDateRange.from).diff(moment.utc(searchedDateRange.to), "days"));
            let curDate = moment.utc(searchedDateRange.from);
            let end = moment.utc(searchedDateRange.to);
            let i = 0;
            while (curDate.isSameOrBefore(end, "date") && i < WHILE_LIMIT) {
                generatedDays.push(
                    curDate.startOf('day').toISOString().replace('.000', '')
                );
                curDate = moment.utc(curDate).add(1, "day");
                i++;
            }
        } else {
            generatedDays = Array(dim).fill(0)
                .map((e, idx) => getAppointmentDate(date, idx+1));
        }
        return [
            dim,
            generatedDays
        ];
    }, [date, searchedDateRange]);

    useEffect(() => {
        if (!dateRangeUpdated) {
            let dateIdx = days.findIndex(el => el === date.toISOString().replace('.000', ''));
            if (dateIdx === -1 || daysInMonth <= daysPerScreen) {
                setSliceIdx(0);
            } else {
                // to get center of the displayed dates
                const nD = dateIdx - Math.floor(daysPerScreen / 2);
                if (nD + daysPerScreen > daysInMonth) {
                    // Handle right date edge
                    setSliceIdx(daysInMonth - daysPerScreen);
                } else {
                    // Handle left date edge
                    setSliceIdx(nD >= 0 ? nD : 0);
                }

                onDateRangeSet(true);
            }
        }
    }, [date, days, daysPerScreen, daysInMonth, dateRangeUpdated, onDateRangeSet]);

    const handleChangeDay = (date: string) => () => {
        onDateChange(moment.utc(date));
    }

    const nextAvailable = (): boolean => {
        return (sliceIdx + daysPerScreen - 1) < daysInMonth;
    }
    const prevAvailable = (): boolean => {
        return sliceIdx > 0;
    }
    const handleNext = () => {
        if (nextAvailable()) {
            setSliceIdx(s => {
                const nS = s + (daysPerScreen * 2);
                return nS <= daysInMonth ? s + daysPerScreen : daysInMonth - daysPerScreen + 1;
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
                    isXs={isXs}
                    isPackage={Boolean(selectedPackage)}
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