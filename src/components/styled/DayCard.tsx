import {styled} from "@mui/material";
import React from "react";

type TDayCardProps = {
    available?: boolean;
    isCurrent?: boolean;
    isOffPeak?: boolean;
}

export const DayCard = styled("div")<TDayCardProps>(({theme, available, isCurrent}) => ({
    flex: "1 0 0px",
    opacity: (!available && !isCurrent) ? .3 : 1,
    display: "flex",
    textTransform: "uppercase",
    flexDirection: "column",
    gap: "4px",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down('mdl')]: {
        gap: "8px"
    }
}));

export const Date = styled("div")({
    fontSize: 14,
})

export const Day = styled("div")<TDayCardProps>(({theme, isCurrent, isOffPeak}) => ({
    width: 48,
    height: 48,
    minHeight: "auto",
    display: "flex",
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    padding: '4px 12px',
    border: isCurrent ? "1px solid #000000" : (isOffPeak ? "1px solid #237243" : "1px solid #DADADA"),
    borderRadius: "50%",
    background: isCurrent ? "#000000" : isOffPeak ? "#E6FCEC" : "#FAFAFA",
    color: isCurrent ? "#FFFFFF" : "#252733",
    fontWeight: "normal",
    fontSize: 14,
    textAlign: "center",
    textTransform: 'capitalize',
    cursor: "pointer",
    '& > svg': {
        marginBottom: 4
    },
    [theme.breakpoints.down('mdl')]: {
        width: 56,
        height: 56,
    }
}))