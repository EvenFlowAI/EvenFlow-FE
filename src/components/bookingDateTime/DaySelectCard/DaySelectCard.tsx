import React from 'react';
import {TCallback} from "../../../types/types";
import {TGroupedAppointment} from "../../../utils/types";
import {ReactComponent as CalendarIcon} from "../../../assets/img/empty_calendar.svg";
import {ReactComponent as CalendarIconWhite} from "../../../assets/img/empty_calendar_white.svg";
import {
    monthDayFormat,
} from "../../../features/booking/AppointmentFlow/Screens/AppointmentSlots/constants";
import {Date, Day, DayCard} from "../../styled/DayCard";
import dayjs from "dayjs";

type TProps = {
    day: string;
    onClick: TCallback;
    isCurrent: boolean;
    appointment?: TGroupedAppointment;
    isXs: boolean;
};

export const DaySelectCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
    day, onClick, appointment, isCurrent, isXs,
}) => {
    const getLabel = () => {
        return dayjs.utc(day).format("ddd");
    }

    const isOffPeak = Boolean(appointment?.amountOfSavingMoney);

    return <DayCard
            available={Boolean(appointment)}
            isCurrent={isCurrent}
            isOffPeak={isOffPeak}
        >
        <Date>{dayjs.utc(day).format(monthDayFormat)}</Date>
        <Day
            available={Boolean(appointment)}
            isCurrent={isCurrent}
            isOffPeak={isOffPeak}
            onClick={onClick}>
            {isCurrent ? <CalendarIconWhite/> : <CalendarIcon/>}
            {getLabel()}
            {isXs ? <div className="padding" /> : null}
        </Day>
    </DayCard>
};