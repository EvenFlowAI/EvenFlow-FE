import React, {Dispatch, SetStateAction} from 'react';
import dayjs from "dayjs";
import {TCallback, TParsableDate} from "../../../../types/types";
import {pickersLayoutClasses} from "@mui/x-date-pickers/PickersLayout";
import {MobileDatePicker} from "@mui/x-date-pickers";

type TProps = {
    time: TParsableDate;
    setTime: Dispatch<SetStateAction<TParsableDate>>;
    isCalendarOpen: boolean;
    setCalendarOpen: Dispatch<SetStateAction<boolean>>;
    onAccept: TCallback;
}

const Calendar: React.FC<TProps> = ({
                                        time,
                                        setTime,
                                        isCalendarOpen,
                                        setCalendarOpen,
                                        onAccept,
}) => {
    const onTimeChange = (value: TParsableDate) => {
        setTime(value);
    }

    const handleAccept = () => {
        onAccept()
        // todo find a way to call the function if the date is unchanged
    }

    return (
        <MobileDatePicker
            value={time}
            onChange={onTimeChange}
            disablePast
            onAccept={handleAccept}
            open={isCalendarOpen}
            onClose={() => setCalendarOpen(false)}
            format="MMMM, DD"
            dayOfWeekFormatter={(day, date) => dayjs(date as TParsableDate).format("ddd")}
            slotProps={{
                textField: {
                    variant: 'standard',
                    InputProps: {
                        style: {display: 'none'}
                    },
                },
                toolbar: {
                    toolbarFormat: "ddd, MMM DD",
                },
                layout: {
                    sx: {
                        [`.${pickersLayoutClasses.toolbar}`]: {
                            backgroundColor: 'black',
                            color: "white"
                        },
                        [`.${pickersLayoutClasses.toolbar} > span`]: {
                            color: "#FFFFFF8A",
                            display: 'none'
                        },
                    },
                },
            }}
        />
    );
};

export default Calendar;