import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import moment from "moment";
import {getFirstLastDaysOfWeek} from "./utils";

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
    selectedDate: moment.Moment;
    onChange: (date: moment.Moment) => void;
}
export const WeekControls: React.FC<TProps> = ({selectedDate, onChange}) => {
    const classes = useStyles();
    const handleLeft = () => {
        onChange(moment(selectedDate).subtract(7, "days"));
    }
    const handleRight = () => {
        onChange(moment(selectedDate).add(7, "days"));
    }

    return (
        <div className={classes.container}>
            <Button onClick={handleLeft} variant="outlined" className={classes.arrowButton}>
                <ChevronLeft />
            </Button>
            <Button variant="outlined" className={classes.dateButton}>
                {getFirstLastDaysOfWeek(selectedDate)}
            </Button>
            <Button onClick={handleRight} variant="outlined" className={classes.arrowButton}>
                <ChevronRight />
            </Button>
        </div>
    );
};