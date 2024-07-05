import React from 'react';
import {TArgCallback} from "../../../types/types";
import {useMediaQuery, useTheme} from "@mui/material";
import {DaySelector} from "../DaySelector/DaySelector";
import {TGroupedAppointments} from "../../../utils/types";
import {useTranslation} from "react-i18next";
import {MonthSelector} from "../MonthSelector/MonthSelector";
import {TMonthProps} from "../../../features/booking/AppointmentSlots/types";

type TProps = {
    onDateRangeSet: TArgCallback<boolean>;
    appointments: TGroupedAppointments;
    dateRangeUpdated: boolean;
    dateChangeDisabled: boolean;
} & TMonthProps;

export const AppointmentDateSelector: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({date, loading, onDateChange,
    appointments, dateChangeDisabled,
    dateRangeUpdated, onDateRangeSet}) => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('md'));
    const {t} = useTranslation();

    return (
        <div>
            {!isXs && <h4>{t("Select Date")}</h4>}
            {!dateChangeDisabled ? <MonthSelector
                date={date}
                loading={loading}
                onDateChange={onDateChange}/> : null}
            <DaySelector
                onDateRangeSet={onDateRangeSet}
                dateRangeUpdated={dateRangeUpdated}
                date={date}
                appointments={appointments}
                loading={loading}
                onDateChange={onDateChange} />
        </div>
    );
};