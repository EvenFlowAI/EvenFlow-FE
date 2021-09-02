import React from 'react';
import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";
import {styled, Theme} from "@material-ui/core";
import {TArgCallback} from "../../../types/types";
import {EDemandCategory} from "../../../store/reducers/pricingSettings/types";

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
    timeSlot: string;
    slot?: IRemappedAppointmentSlot;
    selected: boolean;
    onSelect: TArgCallback<IRemappedAppointmentSlot|null>
}
export const TimeSlotCard: React.FC<TProps> =
    ({timeSlot, slot, onSelect, selected}) => {
    const getContent = () => {
        if (!slot) {
            return "Not Available";
        }
        if (slot.price.amountOfSavingMoney) {
            return `Save $${Math.abs(slot.price.amountOfSavingMoney)}`;
        }
        return "Available";
    }
    const isOffPeak = slot?.price.category === EDemandCategory.High;
    return (
        <Wrapper available={Boolean(slot)} selected={selected} offPeak={isOffPeak}>
            <div>{timeSlot}</div>
            <div onClick={() => onSelect(slot ?? null)} className="availability">{getContent()}</div>
        </Wrapper>
    );
};