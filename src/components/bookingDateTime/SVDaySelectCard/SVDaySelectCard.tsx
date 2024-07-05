import React from 'react';
import {TCallback} from "../../../types/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EAppointmentTimingType, IServiceValetAppointment} from "../../../store/reducers/appointment/types";
import {useTranslation} from "react-i18next";
import {EPricingDisplayType} from "../../../store/reducers/pricingSettings/types";
import {defaultFormat, monthFormat, XsFormat, XsMontFormat} from "../../../features/booking/AppointmentSlots/constants";
import {Date, Day, DayCard, DayName} from "../../styled/DayCard";
import dayjs from "dayjs";

type TProps = {
    day: string;
    onClick: TCallback;
    isCurrent: boolean;
    appointment?: IServiceValetAppointment;
    isXs: boolean;
};

export const SVDaySelectCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
                                                    day, onClick, appointment, isCurrent, isXs
                                                }) => {
    const isCustomRange = useSelector((state: RootState) => {
        return Boolean(
            state.appointment.searchedDateRange
            && state.appointmentFrame.selectedTiming !== EAppointmentTimingType.SpecialOffers
        );
    })
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {t} = useTranslation();

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
        if (appointment?.price?.value && !appointment?.serviceRequestPrices?.find(item => item.pricingDisplayType === EPricingDisplayType.Suppressed)) {
            return `$${scProfile?.isRoundPrice 
                ? appointment.price.value + appointment.price.ancillaryPrice 
                : (appointment.price.value + appointment.price.ancillaryPrice).toFixed(2)}`;
        }
        if (appointment) {
            return t("Available");
        }
        return t("Not Available");
    }

    const getFormat = () => {
        if (isXs) {
            if (isCustomRange) {
                return XsMontFormat;
            }
            return XsFormat;
        } else if (isCustomRange) {
            return monthFormat;
        }
        return defaultFormat;
    }

    const getDayNameString = (): string => {
        const name = dayjs.utc(day).format('ddd').toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    return <DayCard
        available={Boolean(appointment)}
        isCurrent={isCurrent}
        isOffPeak={false}
    >
        <DayName>{getDayNameString()}</DayName>
        <Date>{dayjs.utc(day).format(getFormat())}</Date>
        <Day
            available={Boolean(appointment)}
            isCurrent={isCurrent}
            onClick={onClick}>
            {getLabel()}
            {isXs ? <div className="padding" /> : null}
        </Day>
    </DayCard>
};