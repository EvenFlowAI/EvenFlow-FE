import React, {useMemo} from 'react';
import {Box, styled} from "@material-ui/core";
import moment from "moment";
import {ITimeOfYearSetting} from "../../store/reducers/pricingSettings/types";

type TProps = {
    month: number;
    data: ITimeOfYearSetting[];
}
type TDate = {
    date: moment.Moment;
    data?: ITimeOfYearSetting;
}

const findD = (date: moment.Moment) => (sd: ITimeOfYearSetting) => {
    const tfd = moment(sd.date);
    return tfd.isSame(date, "day") && tfd.isSame(date, "month")
}
const getDays = (start: moment.Moment, end: moment.Moment, dt: ITimeOfYearSetting[]): TDate[] => {
    const dates: TDate[] = [];
    let date = moment(start);
    while (1) {
        const data = dt.find(findD(date));
        dates.push({date, data});
        if (date.isSameOrAfter(end, "date")) {
            break;
        }
        date = moment(date).add(1, "day");
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
export const Month: React.FC<TProps> = ({month, data}) => {
    const [d, start, end] = useMemo(() => {
        const dt = moment.utc().month(month);
        return [
            dt,
            moment.utc(dt).startOf("month").startOf("week"),
            moment.utc(dt).endOf("month").endOf("week")
        ];
    }, [month]);
    const monthDatesData = useMemo(() => getDays(start, end, data), [start, end, data]);

    return <Box display="grid" gridGap={5} gridTemplateColumns="repeat(7, 1fr)">
        <MonthName>{d.format("MMMM")}</MonthName>
        {moment.weekdays().map(wd => <DayName key={wd}>{wd[0]}</DayName>)}
        {monthDatesData.map(mdd => {
            return <Day
                key={mdd.date.toISOString()}
                className={!mdd.date.isSame(d, "month") ? "nonCurrent" : "current"}>
                {mdd.date.format("D")}
            </Day>
        })}
    </Box>
};