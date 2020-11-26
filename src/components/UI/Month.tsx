import React, {useMemo} from 'react';
import {Box, styled} from "@material-ui/core";
import moment from "moment";
import {ITimeOfYearSetting} from "../../store/reducers/pricingSettings/types";
import {noop} from "../../utils/utils";

type TProps = {
    month: number;
    data: ITimeOfYearSetting[];
    onClick: (date: moment.Moment) => void;
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
    },
    cursor: "pointer"
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
export const Month: React.FC<TProps> = ({month, data, onClick}) => {
    const [d, start, end] = useMemo(() => {
        const dt = moment.utc().month(month);
        return [
            dt,
            moment.utc(dt).startOf("month").startOf("week"),
            moment.utc(dt).endOf("month").endOf("week")
        ];
    }, [month]);
    const monthDatesData = useMemo(() => getDays(start, end, data), [start, end, data]);

    const handleClick = (day: number) => () => {
        const mDate = moment.utc().month(month).date(day).hour(0).minute(0).second(0).millisecond(0);
        onClick(mDate);
    }

    return <Box display="grid" gridGap={5} gridTemplateColumns="repeat(7, 1fr)">
        <MonthName>{d.format("MMMM")}</MonthName>
        {moment.weekdays().map(wd => <DayName key={wd}>{wd[0]}</DayName>)}
        {monthDatesData.map(mdd => {
            const dayNumber = mdd.date.format("D");
            return <Day
                key={mdd.date.toISOString()}
                onClick={mdd.date.isSame(d, "month") ? handleClick(Number(dayNumber)) : noop}
                className={!mdd.date.isSame(d, "month") ? "nonCurrent" : "current"}>
                {dayNumber}
            </Day>
        })}
    </Box>
};