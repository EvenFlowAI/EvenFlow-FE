import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";

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
        background: "#ffffff"
    }
});

export const WeekControls = () => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Button variant="outlined" className={classes.arrowButton}>
                <ChevronLeft />
            </Button>
            <Button variant="outlined" className={classes.dateButton}>
                Aug 10 - Aug 15
            </Button>
            <Button variant="outlined" className={classes.arrowButton}>
                <ChevronRight />
            </Button>
        </div>
    );
};