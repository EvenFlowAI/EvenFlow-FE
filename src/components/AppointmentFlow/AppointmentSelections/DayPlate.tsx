import React from 'react';
import {styled} from "@material-ui/core";
import {SquarePaper} from "../../UI/Paper";
import moment from "moment";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

const Paper = styled(SquarePaper)(({theme}) => ({
    display: "flex",
    flexFlow: "column nowrap",
    padding: theme.spacing(1),
    justifyContent: "center",
    alignItems: "center",
    minHeight: 80,
    minWidth: 80,
    cursor: "pointer",
    background: "#fff",
    transition: theme.transitions.create(["background"]),
    "&.selected": {
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
    }
}));

const Weekday = styled("span")({
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16
});
const Date = styled("span")({
    fontSize: 14
});

type TProps = {
    date: ParsableDate;
    offers: boolean;
    selected?: boolean;
    onClick: () => void;
}
export const DayPlate: React.FC<TProps> = ({date, offers, selected, onClick}) => {
    return <Paper
        variant="outlined"
        onClick={onClick}
        className={selected ? "selected" : undefined}>
        <Weekday>{moment(date).format("ddd")}</Weekday>
        <Date>{moment(date).format("D")}</Date>
    </Paper>
};