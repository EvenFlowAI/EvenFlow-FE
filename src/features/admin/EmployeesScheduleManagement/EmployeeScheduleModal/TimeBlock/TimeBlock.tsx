import React, {useMemo} from 'react';
import TimeSelect from "../../../../../components/pickers/TimeSelect/TimeSelect";
import dayjs from "dayjs";
import {time24HourFormat, timeSpanString} from "../../../../../utils/constants";
import {PickersWrapper} from "../../../../../components/styled/PickersWrapper";
import {IHOODataForm} from "../../../../../store/reducers/serviceCenters/types";
import {IScheduleByDate} from "../../../../../store/reducers/schedules/types";
import {scClosesText, scOpensText} from "../constants";

type TProps = {
    formIsChecked: boolean;
    disabledDate: boolean;
    el: IScheduleByDate;
    onTimeChange: (el: IScheduleByDate, field: "startAt" | "finishAt", value: string) => void;
    schedule?: IHOODataForm;
}

const TimeBlock: React.FC<TProps> = ({formIsChecked, schedule, onTimeChange, disabledDate, el}) => {
    const downArrowString = useMemo(() => {
        return schedule?.from
            ? `${scOpensText} ${dayjs(schedule?.from, timeSpanString).format(time24HourFormat)}`
            : ''
    }, [schedule])

    const upArrowString = useMemo(() => {
        return schedule?.to
            ? `${scClosesText} ${dayjs(schedule?.to, timeSpanString).format(time24HourFormat)}`
            : ''
    }, [schedule])

    return (
        <PickersWrapper>
            <TimeSelect
                disableClearable
                error={
                    formIsChecked && el.isOnSchedule
                    && (!el.startAt
                        || dayjs(el.finishAt, timeSpanString).isSameOrBefore(dayjs(el.startAt, timeSpanString), 'minute')
                        || dayjs(el.startAt, timeSpanString).isBefore(dayjs(schedule?.from, timeSpanString), 'minute')
                        || dayjs(el.startAt, timeSpanString).isAfter(dayjs(schedule?.to, timeSpanString), 'minute'))
                }
                disabled={!el.isOnSchedule || disabledDate}
                start={schedule?.from ?? "09:00:00"}
                end={schedule?.to ?? "17:00:00"}
                value={el.startAt}
                downArrowErrorText={downArrowString}
                upArrowErrorText={upArrowString}
                onChange={(value) => onTimeChange(el, 'startAt', value)}/>
            <div>TO</div>
            <TimeSelect
                disableClearable
                error={
                    formIsChecked && el.isOnSchedule
                    && (!el.finishAt
                        || dayjs(el.finishAt, timeSpanString).isSameOrBefore(dayjs(el.startAt, timeSpanString), 'minute')
                        || dayjs(el.finishAt, timeSpanString).isAfter(dayjs(schedule?.to, timeSpanString), 'minute')
                        || dayjs(el.finishAt, timeSpanString).isBefore(dayjs(schedule?.from, timeSpanString), 'minute'))
                }
                disabled={!el.isOnSchedule || disabledDate}
                start={schedule?.from ?? "09:00:00"}
                end={schedule?.to ?? "17:00:00"}
                value={el.finishAt}
                downArrowErrorText={downArrowString}
                upArrowErrorText={upArrowString}
                onChange={(value) => onTimeChange(el, 'finishAt', value)}/>
        </PickersWrapper>
    );
};

export default TimeBlock;