import React, {useMemo} from 'react';
import {Box} from "@mui/material";
import moment from "moment";
import {EDemandCategory, ITimeOfYearSetting} from "../../../../store/reducers/pricingSettings/types";
import {noop} from "../../../../utils/utils";
import {Day, DayName, MonthName} from "./styles";
import {getDays} from "./utils";

type TProps = {
    month: number;
    data: ITimeOfYearSetting[];
    onClick: (date: moment.Moment, data?: ITimeOfYearSetting) => void;
}

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

    const handleClick = (day: number, data?: ITimeOfYearSetting) => () => {
        const mDate = moment.utc().month(month).date(day).hour(0).minute(0).second(0).millisecond(0);
        onClick(mDate, data);
    }

    return (
        <Box display="grid" gap={'3px'} gridTemplateColumns="repeat(7, 1fr)">
            <MonthName>{d.format("MMMM")}</MonthName>
            {moment.weekdays().map(wd => <DayName key={wd}>{wd[0]}</DayName>)}
            {monthDatesData.map((mdd, idx) => {
                const dayNumber = mdd.date.format("D");
                return <Day
                    key={idx}
                    onClick={mdd.date.isSame(d, "month") ? handleClick(Number(dayNumber), mdd.data) : noop}
                    className={[
                        !mdd.date.isSame(d, "month") ? "nonCurrent" : "current",
                        !mdd.data ? "" : mdd.data.demandCategory === EDemandCategory.Low ? "low"
                            : mdd.data.demandCategory === EDemandCategory.Average ? "average" : "high"
                    ].join(" ")}>
                    <span>{dayNumber}</span>
                </Day>
            })}
        </Box>
    );
};