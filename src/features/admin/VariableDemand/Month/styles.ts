import {styled} from "@mui/material";

export const Day = styled("div")(({theme}) => ({
    textAlign: "center",
    fontSize: 9,
    "&>span": {
        borderRadius: "50%",
        height: 23,
        width: 23,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    "&.nonCurrent": {
        color: "#bebebe"
    },
    "&.low>span": {
        backgroundColor: "#00ADB8",
        color: "#fff",
        fontWeight: "bold",
    },
    "&.average>span": {
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
        fontWeight: "bold",
    },
    "&.high>span": {
        backgroundColor: theme.palette.secondary.main,
        color: "#fff",
        fontWeight: "bold",
    },
    cursor: "pointer"
}));

export const DayName = styled("div")({
    textAlign: "center",
    fontSize: 9,
});

export const MonthName = styled("div")({
    gridRow: 1,
    gridColumnEnd: 8,
    gridColumnStart: 1,
    paddingLeft: 8
});