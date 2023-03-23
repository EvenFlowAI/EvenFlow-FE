import React from 'react';
import {TArgCallback} from "../../../types/types";
import {useMediaQuery, useTheme} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {SVDaySelector} from "./SVDaySelector";
import {MonthSelector, TMonthProps} from "./AppointmentDateSelector";

type TProps = {
    onDateRangeSet: TArgCallback<boolean>;
    dateRangeUpdated: boolean;
    dateChangeDisabled: boolean;
} & TMonthProps;

export const SVAppointmentDateSelector: React.FC<TProps> = ({
                                                                date,
                                                                loading,
                                                                onDateChange,
                                                                dateChangeDisabled,
                                                                dateRangeUpdated,
                                                                onDateRangeSet
}) => {
    const {serviceValetSlots} = useSelector((state: RootState) => state.appointment);
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const {t} = useTranslation();

    return (
        <div>
            {!isXs && <h4>{t("Select Date")}</h4>}
            {!dateChangeDisabled ? <MonthSelector
                date={date}
                loading={loading}
                onDateChange={onDateChange}/> : null}
            <SVDaySelector
                onDateRangeSet={onDateRangeSet}
                dateRangeUpdated={dateRangeUpdated}
                date={date}
                appointments={serviceValetSlots}
                loading={loading}
                onDateChange={onDateChange} />
        </div>
    );
};