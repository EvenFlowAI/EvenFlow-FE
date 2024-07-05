import React from 'react';
import {TCallback} from "../../../types/types";
import {TGroupedAppointment, TGroupedAppointments} from "../../../utils/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {ReactComponent as CalendarIcon} from "../../../assets/img/empty_calendar.svg";
import {ReactComponent as CalendarIconWhite} from "../../../assets/img/empty_calendar_white.svg";
import {monthFormat, XsMontFormat} from "../../../features/booking/AppointmentSlots/constants";
import {Date, Day, DayCard, DayName} from "../../styled/DayCard";
import dayjs from "dayjs";

type TProps = {
    day: string;
    onClick: TCallback;
    isCurrent: boolean;
    appointment?: TGroupedAppointment;
    isXs: boolean;
    appointments: TGroupedAppointments;
};

export const DaySelectCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
    day, onClick, appointment, isCurrent, isXs, appointments,
}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {t} = useTranslation();
    const getMaxPrice = () => {
        if (appointment) {
            const prices = appointment.appointments
                .filter(app => dayjs(app.appointmentDate).isSame(dayjs(appointment.date), 'day'))
                .map(item => item.price.value)
            return Math.max(...prices);
        }
    }

    const getLabel = () => {
        if (isXs) {
            return dayjs.utc(day).format("D");
        }
        if (isCurrent) {
            if (appointment) {
                return t("Available");
            } else {
                return t("Not Available");
            }
        }
        if (appointment?.lowestPrice) {
            const price = getMaxPrice();
            if (price) {
                return `$${scProfile?.isRoundPrice ? price : price.toFixed(2)}`;
            } else {
                return t("Available");
            }
        }
        if (appointment) {
            return t("Available");
        }
        return t("Not Available");
    }

    const isOffPeak = Boolean(appointment?.amountOfSavingMoney);
    const getDayNameString = (): string => {
        const name = dayjs.utc(day).format('ddd').toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    return <DayCard
            available={Boolean(appointment)}
            isCurrent={isCurrent}
            isOffPeak={isOffPeak}
        >
        <DayName>{getDayNameString()}</DayName>
        <Date>{dayjs.utc(day).format(isXs ? XsMontFormat : monthFormat)}</Date>
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