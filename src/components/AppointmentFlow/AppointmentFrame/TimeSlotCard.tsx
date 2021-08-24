import React from 'react';
import {IAppointmentSlot, IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";
import {styled, Theme} from "@material-ui/core";
import {TArgCallback} from "../../../types/types";

const Wrapper = styled('div')<Theme, {available?: boolean, selected?: boolean}>({
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    flexDirection: "column",
    gap: "6px",
    opacity: ({available}) => available ? 1 : .3,
    '& .availability': {
        cursor: "pointer",
        border: ({selected}) => `1px solid ${selected ? '#000000' : '#DADADA'}`,
        padding: 20,
        minHeight: 80,
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
    },
})

type TProps = {
    timeSlot: string;
    slot?: IRemappedAppointmentSlot;
    selected: boolean;
    onSelect: TArgCallback<IRemappedAppointmentSlot|null>
}
export const TimeSlotCard: React.FC<TProps> =
    ({timeSlot, slot, onSelect, selected}) => {
    return (
        <Wrapper available={Boolean(slot)} selected={selected}>
            <div>{timeSlot}</div>
            <div onClick={() => onSelect(slot ?? null)} className="availability">{slot ? "Slot" : "Not Available"}</div>
        </Wrapper>
    );
};