import React from 'react';
import {TCallback} from "../../../types/types";
import {styled, Theme} from "@material-ui/core";
import moment from "moment";
import {TGroupedAppointment} from "../../../utils/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EAppointmentTimingType} from "../../../store/reducers/appointment/types";


type TDayCardProps = {
    available?: boolean;
    isCurrent?: boolean;
}
const DayCard = styled('div')<Theme, TDayCardProps>(({theme, available, isCurrent}) => ({
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
        border: isCurrent ? "1px solid #000000" : "1px solid #DADADA",
        padding: 12,
        display: "flex",
        width: "100%",
        alignItems: "center",
        background: isCurrent ? "#000000" : "#FAFAFA",
        color: isCurrent ? "#FFFFFF" : "#252733",
        justifyContent: "center",
        textAlign: "center",
        minHeight: 80,
        fontWeight: "bold",
        textTransform: "uppercase",
        cursor: "pointer",
        height: "auto",
        [theme.breakpoints.down("xs")]: {
            borderRadius: "50%",
            minHeight: "auto",
            width: 50,
            height: 50
        }
    }
}));

type TProps = {
    day: string;
    onClick: TCallback;
    isCurrent: boolean;
    appointment?: TGroupedAppointment;
    isXs: boolean;
    isPackage: boolean;
};

const XsFormat = "ddd";
const defaultFormat = 'D, ddd';
const monthFormat = "MMM D";
const XsMontFormat = "MMM";

export const DaySelectCard: React.FC<TProps> = ({
    day, onClick, appointment, isCurrent, isPackage, isXs
}) => {
    const isCustomRange = useSelector((state: RootState) => {
        return Boolean(
            state.appointment.searchedDateRange
            && state.appointmentFrame.selectedTiming !== EAppointmentTimingType.SpecialOffers
        );
    })

    const getLabel = () => {
        if (isXs) {
            return moment.utc(day).format("D");
        }
        if (isCurrent) {
            if (appointment) {
                return "Available";
            } else {
                return "Not Available";
            }
        }
        if (appointment && isPackage) {
            return `$${appointment.lowestPrice}`;
        }
        if (appointment) {
            return "Available";
        }
        return "Not Available";
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

    return <DayCard
            available={Boolean(appointment)}
            isCurrent={isCurrent}
        >
        <div>{moment.utc(day).format(getFormat())}</div>
        <div className="day" onClick={onClick}>
            {getLabel()}
            {isXs ? <div className="padding" /> : null}
        </div>
    </DayCard>
};