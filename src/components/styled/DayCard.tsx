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
    gap: "8px",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
}));

export const DayName = styled("div")({
    fontSize: 14,
    fontWeight: "normal",
    marginBottom: -12,
    textTransform: 'none'
})

export const Date = styled("div")({
    fontSize: 14,
})

export const Day = styled("div")<TDayCardProps>(({theme, isCurrent, isOffPeak}) => ({
    height: "auto",
    minHeight: 80,
    display: "flex",
    flexDirection: 'column',
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: '4px 12px',
    border: isCurrent ? "1px solid #000000" : "1px solid #DADADA",
    background: isCurrent ? "#000000" : "#FAFAFA",
    color: isCurrent ? "#FFFFFF" : "#252733",
    fontWeight: "bold",
    textTransform: "uppercase",
    cursor: "pointer",
    fontSize: 14,
    '& > svg': {
        marginBottom: 4
    },
    [theme.breakpoints.down('sm')]: {
        width: 50,
        height: 50,
        minHeight: "auto",
        border: isCurrent ? "1px solid #000000" : (isOffPeak ? "1px solid #237243" : "1px solid #DADADA"),
        borderRadius: "50%",
        background: isCurrent ? "#000000" : isOffPeak ? "#89E5AB" : "#FAFAFA",
    }
}))