import React, {useState} from 'react';
import {Button} from "@mui/material";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import moment from "moment";
import {getFirstLastDaysOfWeek} from "../utils";
import {useStyles} from "./styles";
import {CustomDatePicker} from "../../../../components/pickers/DatePicker/CustomDatePicker";

type TProps = {
    isXS: boolean;
    selectedDate: moment.Moment;
    onChange: (date: moment.Moment) => void;
}

export const WeekControls: React.FC<React.PropsWithChildren<TProps>> = ({selectedDate, isXS, onChange}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const classes = useStyles();

    const handleLeft = () => {
        onChange(moment(selectedDate).subtract(!isXS ? 7 : 1, "days"));
    }

    const handleRight = () => {
        onChange(moment(selectedDate).add(!isXS ? 7 : 1, "days"));
    }

    const handleOpen = (s: boolean) => () => {
        setIsOpen(s);
    }

    const handleDateChange = (date: moment.Moment) => {
        onChange(moment(date));
    }

    return (
        <div className={classes.container}>
            <Button onClick={handleLeft} variant="outlined" className={classes.arrowButton}>
                <ChevronLeft />
            </Button>
            <Button onClick={handleOpen(true)} variant="outlined" className={classes.dateButton}>
                {getFirstLastDaysOfWeek(selectedDate, isXS)}
            </Button>
            <Button onClick={handleRight} variant="outlined" className={classes.arrowButton}>
                <ChevronRight />
            </Button>
            <CustomDatePicker
                style={{display: "none"}}
                onOpen={handleOpen(true)}
                onClose={handleOpen(false)}
                open={isOpen}
                value={selectedDate}
                onChange={handleDateChange}
            />
        </div>
    );
};