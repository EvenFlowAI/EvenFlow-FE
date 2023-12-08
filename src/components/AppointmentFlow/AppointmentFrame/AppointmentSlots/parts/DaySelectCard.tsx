import React from 'react';
import {TCallback} from "../../../../../types/types";
import {styled, Theme} from "@material-ui/core";
import moment from "moment";
import {TGroupedAppointment, TGroupedAppointments} from "../../../../../utils/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {ReactComponent as CalendarIcon} from "../../../../../assets/img/empty_calendar.svg";
import {ReactComponent as CalendarIconWhite} from "../../../../../assets/img/empty_calendar_white.svg";

type TDayCardProps = {
    available?: boolean;
    isCurrent?: boolean;
    isOffPeak?: boolean;
}

export const DayCard = styled(({available, isCurrent, isOffPeak, ...props}) => (<div {...props}/>))<Theme, TDayCardProps>(({theme, available, isCurrent, isOffPeak}) => ({
    flex: "1 0 0px",
    opacity: (!available && !isCurrent) ? .3 : 1,
    display: "flex",
    textTransform: "uppercase",
    flexDirection: "column",
    gap: "8px",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    "& .day": {
        height: "auto",
        minHeight: 80,
        display: "flex",
        flexDirection: 'column',
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: '4px 12px',
        border: isCurrent ? "1px solid #000000" : "1px solid #DADADA",
        background: isCurrent ? "#000000" : "#FAFAFA",
        color: isCurrent ? "#FFFFFF" : "#252733",
        fontWeight: "bold",
        textTransform: "uppercase",
        cursor: "pointer",
        '& > svg': {
            marginBottom: 4
        },
        [theme.breakpoints.down("xs")]: {
            width: 50,
            height: 50,
            minHeight: "auto",
            border: isCurrent ? "1px solid #000000" : (isOffPeak ? "1px solid #237243" : "1px solid #DADADA"),
            borderRadius: "50%",
            background: isCurrent ? "#000000" : isOffPeak ? "#89E5AB" : "#FAFAFA",
        }
    },
    "& .dayName": {
        fontSize: 14,
        fontWeight: "normal",
        marginBottom: -12,
        textTransform: 'none'
    },
}));

type TProps = {
    day: string;
    onClick: TCallback;
    isCurrent: boolean;
    appointment?: TGroupedAppointment;
    isXs: boolean;
    appointments: TGroupedAppointments;
};

export const XsFormat = "ddd";
export const defaultFormat = 'D, ddd';
export const monthFormat = "MMM D";
export const XsMontFormat = "MMM";

export const DaySelectCard: React.FC<TProps> = ({
    day, onClick, appointment, isCurrent, isXs, appointments,
}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {t} = useTranslation();
    const getMaxPrice = () => {
        if (appointment) {
            const prices = appointment.appointments
                .filter(app => moment(app.appointmentDate).isSame(moment(appointment.date), 'day'))
                .map(item => item.price.value)
            return Math.max(...prices);
        }
    }

    getMaxPrice()

    const getLabel = () => {
        if (isXs) {
            return moment.utc(day).format("D");
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
        const name = moment.utc(day).format('ddd').toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    return <DayCard
            available={Boolean(appointment)}
            isCurrent={isCurrent}
            isOffPeak={isOffPeak}
        >
        <div className="dayName">{getDayNameString()}</div>
        <div>{moment.utc(day).format(isXs ? XsMontFormat : monthFormat)}</div>
        <div className="day" onClick={onClick}>
            {isCurrent ? <CalendarIconWhite/> : <CalendarIcon/>}
            {getLabel()}
            {isXs ? <div className="padding" /> : null}
        </div>
    </DayCard>
};