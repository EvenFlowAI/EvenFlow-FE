import React, {useMemo} from 'react';
import {ArrowWrapper, ButtonAmPm, Wrapper} from "./styles";
import dayjs from "dayjs";
import {Autocomplete, TextField} from "@mui/material";
import {ReactComponent as CounterUp} from '../../../assets/img/counter1.svg'
import {ReactComponent as CounterDown} from '../../../assets/img/counter2.svg'

type TPeriod = "am"|"pm";

type TProps = {
    start: string;
    end: string;
    value: string;
    onChange: (newValue: string) => void;
    period: TPeriod|null;
    onPeriodChange: (newPeriod: TPeriod|null) => void;
    gap?: number;
}

const hourFormat = "HH:mm"

const TimeSelect: React.FC<TProps> = ({
                                          gap = 30,
                                          start = '08:00',
                                          end= "18:00",
                                          onPeriodChange,
                                          value,
                                          onChange,
                                          period}) => {
    const timeOptions = useMemo(() => {
       const startTime = dayjs(start, hourFormat)
       const endTime = dayjs(end, hourFormat)
        const options: string[] = [];
       let currentTime = startTime;
       while (currentTime.isBefore(endTime)) {
           options.push(currentTime.format(hourFormat))
           currentTime = currentTime.add(gap, 'minute')
       }
       return options;
    }, [gap, start, end])

    const upEnabled = useMemo(() => {
        return dayjs(value, hourFormat).isBefore(dayjs(end, hourFormat))
    }, [value, end])

    const downEnabled = useMemo(() => {
        return dayjs(value, hourFormat).isAfter(dayjs(start, hourFormat))
    }, [value, start])

    const onAutocompleteChange = (e: React.ChangeEvent<{}>, option: string) => {
       onChange(option)
    }

    const onClickUp = () => {
        if (upEnabled) {
            onChange(dayjs(value, hourFormat).add(gap, 'minute').format(hourFormat))
        }
    }
    const onClickDown = () => {
        if (downEnabled) {
            onChange(dayjs(value, hourFormat).subtract(gap, 'minute').format(hourFormat))
        }
    }

    return (
        <Wrapper>
            <Autocomplete
                options={timeOptions}
                disableClearable
                onChange={onAutocompleteChange}
                value={value}
                renderInput={params => <TextField {...{
                    ...params, InputProps: {
                        ...params.InputProps,
                        disableUnderline: true,
                        style: {padding: '0 5px', width: 86, borderRadius: 2, fontSize: 14 },
                        placeholder: start,
                        endAdornment: <div>
                            <ArrowWrapper onClick={onClickUp}><CounterUp/></ArrowWrapper>
                            <ArrowWrapper onClick={onClickDown}><CounterDown/></ArrowWrapper>
                        </div>
                    }}}/>
            }
            />
            <div style={{lineHeight: 0}}>
                <ButtonAmPm isUpper onClick={() => onPeriodChange("am")} selected={period === "am"}>AM</ButtonAmPm>
                <ButtonAmPm onClick={() => onPeriodChange("pm")} selected={period === "pm"}>PM</ButtonAmPm>
            </div>
        </Wrapper>
    );
};

export default TimeSelect;