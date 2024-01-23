import React, {useState} from 'react';
import dayjs, {Dayjs} from "dayjs";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {DatePicker, MobileTimePicker} from "@mui/x-date-pickers";
import {QueryBuilder} from "@mui/icons-material";
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const MuiXDatePicker = () => {
    const [dateTime, setDateTime] = useState<Dayjs|null>(dayjs('00:00:00', 'hh:mm:ss'))
    console.log(dateTime)

    return (
        <div>
        <TimePicker value={dateTime} onChange={(value: any) => setDateTime(value)}/>
        <DatePicker value={dateTime} onChange={(value: any) => setDateTime(value)}/>
            <MobileTimePicker
                value={dateTime}
                onChange={(value: any) => setDateTime(value)}
                label={"ssf"}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        InputProps:{
                            endAdornment: <QueryBuilder htmlColor="grey" />
                        }
                    }
            }}/>
        </div>
    );
};

export default MuiXDatePicker;