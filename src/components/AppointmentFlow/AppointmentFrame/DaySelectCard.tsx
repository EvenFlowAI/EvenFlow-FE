import React from 'react';
import {TCallback} from "../../../types/types";
import {styled, Theme} from "@material-ui/core";
import moment from "moment";
import {TGroupedAppointment} from "../../../utils/types";


type TDayCardProps = {
    available?: boolean;
    isCurrent?: boolean;
}
const DayCard = styled('div')<Theme, TDayCardProps>({
    flexGrow: 1,
    opacity: ({available, isCurrent}) => (!available && !isCurrent) ? .3 : 1,
    display: "flex",
    textTransform: "uppercase",
    flexDirection: "column",
    gap: "8px",
    fontWeight: "bold",
    "& .day": {
        border: ({isCurrent}) => isCurrent ? "1px solid #000000" : "1px solid #DADADA",
        padding: 12,
        display: "flex",
        alignItems: "center",
        background: ({isCurrent}) => isCurrent ? "#000000" : "#FAFAFA",
        color: ({isCurrent}) => isCurrent ? "#FFFFFF" : "#252733",
        justifyContent: "center",
        textAlign: "center",
        minHeight: 80,
        fontWeight: "bold",
        textTransform: "uppercase",
        cursor: "pointer"
    }
});

type TProps = {
    day: string;
    onClick: TCallback;
    isCurrent: boolean;
    appointment?: TGroupedAppointment;
};
export const DaySelectCard: React.FC<TProps> = ({
    day, onClick, appointment, isCurrent
}) => {
    return <DayCard
            available={Boolean(appointment)}
            isCurrent={isCurrent}
        >
        <div>{moment.utc(day).format('D, ddd')}</div>
        <div className="day" onClick={onClick}>
            {appointment ? "Available" : "Not Available"}
        </div>
    </DayCard>
};