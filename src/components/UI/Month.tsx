import React, {useMemo} from 'react';
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {Box, styled} from "@material-ui/core";
import moment from "moment";

type TProps = {
    date: ParsableDate;
}
const getDays = (start: moment.Moment, end: moment.Moment): moment.Moment[] => {
    const dates: moment.Moment[] = [];
    let d = moment(start);
    while (1) {
        dates.push(d);
        if (d.isSameOrAfter(end, "date")) {
            break;
        }
        d = moment(d).add(1, "day");
    }
    return dates;
}

const Day = styled("div")({
    textAlign: "center",
    fontSize: 9,
    "&.nonCurrent": {
        color: "#bebebe"
    }
})
const DayName = styled("div")({
    textAlign: "center",
    fontSize: 9,
});
const MonthName = styled("div")({
    gridRow: 1,
    gridColumnEnd: 8,
    gridColumnStart: 1,
    paddingLeft: 8
});
export const Month: React.FC<TProps> = ({date}) => {
    const [d, start, end] = useMemo(() => [
        moment.utc(date),
        moment.utc(date).startOf("month").startOf("week"),
        moment.utc(date).endOf("month").endOf("week")

    ], [date]);
    const monthDates = useMemo(() => getDays(start, end), [start, end]);

    return <Box display="grid" gridGap={5} gridTemplateColumns="repeat(7, 1fr)">
        <MonthName>{d.format("MMMM")}</MonthName>
        {moment.weekdays().map(wd => <DayName key={wd}>{wd[0]}</DayName>)}
        {monthDates.map(dt => {
            return <Day key={dt.toISOString()} className={!dt.isSame(d, "month") ? "nonCurrent" : "current"}>{dt.format("D")}</Day>
        })}
    </Box>
};