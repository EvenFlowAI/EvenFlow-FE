import React, {useEffect, useMemo, useState} from 'react';
import {ArrowWrapper, ButtonAmPm, Wrapper} from "./styles";
import dayjs from "dayjs";
import {Autocomplete, TextField} from "@mui/material";
import {ReactComponent as CounterUp} from '../../../assets/img/counter1.svg'
import {ReactComponent as CounterUpDisabled} from '../../../assets/img/counter1_disabled.svg'
import {ReactComponent as CounterDown} from '../../../assets/img/counter2.svg'
import {ReactComponent as CounterDownDisabled} from '../../../assets/img/counter2_disabled.svg'
import {TDayPeriod} from "../../../types/types";
import {hourFormat, time12HourFormat, timeSpanString, twelveHourFormat} from "../../../utils/constants";

type TProps = {
    start: string;
    end: string;
    value?: string;
    onChange: (newValue: string) => void;
    gap?: number;
    disabled?: boolean;
    error?: boolean;
}

const TimeSelect: React.FC<TProps> = ({
                                          gap = 30,
                                          start = '08:00',
                                          end= "18:00",
                                          value,
                                          onChange,
                                          disabled,
                                          error}) => {
    const [period, setPeriod] = useState<TDayPeriod>("am")

    const timeOptions = useMemo(() => {
        const startTime = dayjs("01:00", hourFormat)
        const endTime = dayjs("12:00", hourFormat)
        const options: string[] = [];
        let currentTime = startTime;
        while (currentTime.isSameOrBefore(endTime)) {
            options.push(currentTime.format(hourFormat))
            currentTime = currentTime.add(gap, 'minute')
        }
        return options;
    }, [gap, start, end])

    useEffect(() => {
        if (value) {
            setPeriod(dayjs(value, timeSpanString).format("a") as TDayPeriod)
        }
    }, [value])

    const upEnabled = useMemo(() => {
        return dayjs(value, timeSpanString).isBefore(dayjs(end, timeSpanString))
    }, [value, end])

    const downEnabled = useMemo(() => {
        return dayjs(value, timeSpanString).isAfter(dayjs(start, timeSpanString))
    }, [value, start])

    const onPeriodChange = (period: TDayPeriod) => {
        setPeriod(period);
        const pureHours = dayjs(value, timeSpanString).format(twelveHourFormat)
        onChange(dayjs(`${pureHours} ${period}`, time12HourFormat).format(timeSpanString))
    }

    const onAutocompleteChange = (e: React.ChangeEvent<{}>, option: string) => {
       onChange(dayjs(`${option} ${period}`, time12HourFormat).format(timeSpanString))
    }

    const onClickUp = () => {
        if (upEnabled && !disabled) {
            onChange(dayjs(value, timeSpanString).add(gap, 'minute').format(timeSpanString))
        }
    }
    const onClickDown = () => {
        if (downEnabled && !disabled) {
            onChange(dayjs(value, timeSpanString).subtract(gap, 'minute').format(timeSpanString))
        }
    }

    return (
        <Wrapper>
            <Autocomplete
                options={timeOptions}
                disableClearable
                disabled={disabled}
                isOptionEqualToValue={(option, value) => dayjs(`${option} ${period}`, time12HourFormat).isSame(dayjs(value, timeSpanString), 'minute')}
                onChange={onAutocompleteChange}
                value={value ? dayjs(value, timeSpanString).format(twelveHourFormat) : ''}
                renderInput={params => <TextField {...{
                    ...params, InputProps: {
                        ...params.InputProps,
                        disableUnderline: true,
                        style: {padding: '2px 5px', width: 86, borderRadius: 2, fontSize: 14, border: 0 },
                        placeholder: "Select",
                        error,
                        endAdornment: <div>
                            <ArrowWrapper disabled={Boolean(disabled || error)} onClick={onClickUp}>
                                {!disabled ? <CounterUp/> : <CounterUpDisabled/>}
                            </ArrowWrapper>
                            <ArrowWrapper disabled={Boolean(disabled || error)} onClick={onClickDown}>
                                {!disabled ? <CounterDown/> : <CounterDownDisabled/>}
                            </ArrowWrapper>
                        </div>
                    }}}
                />
            }
            />
            <div style={{lineHeight: 0}}>
                <ButtonAmPm
                    isUpper
                    onClick={() => disabled ? {} : onPeriodChange("am")}
                    selected={period === "am" as TDayPeriod}
                    disabled={disabled}>
                    AM
                </ButtonAmPm>
                <ButtonAmPm
                    onClick={() => disabled ? {} : onPeriodChange("pm")}
                    disabled={disabled}
                    selected={period === "pm" as TDayPeriod}>
                    PM
                </ButtonAmPm>
            </div>
        </Wrapper>
    );
};

export default TimeSelect;