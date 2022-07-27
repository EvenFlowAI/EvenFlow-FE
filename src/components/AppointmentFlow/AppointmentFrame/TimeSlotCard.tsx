import React, {useEffect, useState} from 'react';
import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";
import {styled, Theme} from "@material-ui/core";
import {TArgCallback} from "../../../types/types";
import moment from "moment";
import {TSlot} from "./AppointmentTimeSelector";

const Wrapper = styled('div')<Theme, {available?: boolean, selected?: boolean, offPeak?: boolean}>(({theme, available, offPeak, selected}) => ({
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    flexDirection: "column",
    gap: "6px",
    opacity: available ? 1 : .3,
    '& .availability': {
        cursor: "pointer",
        border: `1px solid ${(offPeak && selected)
            ? "#237243" : offPeak
                ? "#89E5AB" : selected
                    ? '#000000' : '#DADADA'}`,
        background: selected ? "#000000" : offPeak ? "#DEFFDF" : "transparent",
        padding: 20,
        color: selected ? '#FFFFFF' : theme.palette.text.primary,
        minHeight: 80,
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
    },
}))

type TProps = {
    timeSlot: TSlot;
    slot?: IRemappedAppointmentSlot;
    selected: boolean;
    onSelect: TArgCallback<IRemappedAppointmentSlot|null>;
    date: moment.Moment|null;
}
export const TimeSlotCard: React.FC<TProps> =
    ({timeSlot, slot, onSelect, selected, date}) => {
        const [timePassed, setTimePassed] = useState<boolean>(false);

        useEffect(() => {
            if (slot?.date && moment(slot?.date).isSame(moment(), 'day')) {
                const differenceInMSeconds = moment(slot?.date.format('YYYY-MM-DDTHH:mm:ss')).diff(moment());
                const timeOut = setTimeout(() => setTimePassed(true), differenceInMSeconds);
                if (moment(date).isSame(moment(), 'day')) {
                    if (differenceInMSeconds < 0) {
                        clearTimeout(timeOut);
                        setTimePassed(true);
                    } else {
                        clearTimeout(timeOut);
                        setTimePassed(false);
                    }
                } else {
                    clearTimeout(timeOut);
                    setTimePassed(false);
                }
            }
        }, [slot, date])

        const getContent = (timePassed: boolean): string => {
            if (!slot || timePassed) {
                return "Not Available";
            }
            if (slot.price.amountOfSavingMoney) {
                return `Save $${slot.price.amountOfSavingMoney}`;
            }
            return "Available";
        }

        const isOffPeak = Boolean(slot?.price.amountOfSavingMoney);
        return (
            <Wrapper available={Boolean(slot) && !timePassed} selected={selected} offPeak={isOffPeak}>
                <div>{timeSlot.label}</div>
                <div onClick={() => timePassed ? {} : onSelect(slot ?? null)} className="availability">{getContent(timePassed)}</div>
            </Wrapper>
        );
    };