import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import moment from "moment";
import {getFirstLastDaysOfWeek} from "./utils";
import {DatePicker} from "@material-ui/pickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";

const useStyles = makeStyles({
    container: {
        display: "inline-flex",
        "&>*": {
            marginLeft: 8,
        }
    },
    arrowButton: {
        minWidth: 10,
        padding: 5,
        background: "#ffffff"
    },
    dateButton: {
        background: "#ffffff",
        textTransform: "none",
        minWidth: 140
    }
});

type TProps = {
    isXS: boolean;
    selectedDate: moment.Moment;
    onChange: (date: moment.Moment) => void;
}
export const WeekControls: React.FC<TProps> = ({selectedDate, isXS, onChange}) => {
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
    const handleDateChange = (date: MaterialUiPickersDate) => {
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
            <DatePicker
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