import React from 'react';
import {IAppointmentSlot} from "../../../store/reducers/appointment/types";
import {styled, Theme} from "@material-ui/core";

const Wrapper = styled('div')<Theme, {available?: boolean}>({
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    flexDirection: "column",
    gap: "6px",
    opacity: ({available}) => available ? 1 : .3,
    '& .availability': {
        border: '1px solid #DADADA',
        padding: 20,
        minHeight: 80,
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
    }
})

type TProps = {
    timeSlot: string;
    slot: IAppointmentSlot|null;
}
export const TimeSlotCard: React.FC<TProps> = ({timeSlot, slot}) => {
    return (
        <Wrapper available={false}>
            <div>{timeSlot}</div>
            <div className="availability">Not Available</div>
        </Wrapper>
    );
};