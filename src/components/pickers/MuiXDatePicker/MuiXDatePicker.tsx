import React, {useState} from 'react';
import moment from 'moment';
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import dayjs, {Dayjs} from "dayjs";
import {DatePicker, MobileTimePicker, TimeField} from "@mui/x-date-pickers";
import {QueryBuilder} from "@mui/icons-material";
import {TextField} from "@mui/material";
import {timeSpanString} from "../../../utils/constants";

const MuiXDatePicker = () => {
    const [dateTime, setDateTime] = useState<Dayjs|null>(dayjs('2022-04-17'))
    console.log(dateTime?.format(timeSpanString))
    // @ts-ignore
    return (
        <div>
        <TimePicker value={dateTime} onChange={(value: any) => setDateTime(value)}/>
        <DatePicker value={dateTime} onChange={(value: any) => setDateTime(value)}/>
            <MobileTimePicker
                value={dateTime}
                onChange={(value: any) => setDateTime(value)}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        InputProps:{
                            endAdornment: <QueryBuilder htmlColor="grey" />
                        }
                    }
            }}/>
        {/*<MobileTimePicker slots={{*/}
        {/*    textField:() =>  <TimeField InputProps={{endAdornment: <QueryBuilder/>}} value={value} onChange={(value: any) => setValue(value)} />*/}
        {/*}}/>*/}
        </div>
    );
};

export default MuiXDatePicker;