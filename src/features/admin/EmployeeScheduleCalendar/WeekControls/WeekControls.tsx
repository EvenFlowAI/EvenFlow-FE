import React, {useState} from 'react';
import {Button} from "@mui/material";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import {getFirstLastDaysOfWeek} from "../utils";
import {useStyles} from "./styles";
import {CustomDatePicker} from "../../../../components/pickers/CustomDatePicker/CustomDatePicker";
import dayjs from "dayjs";
import {TParsableDate} from "../../../../types/types";

type TProps = {
    isXS: boolean;
    selectedDate: TParsableDate;
    onChange: (date: TParsableDate) => void;
}

export const WeekControls: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({selectedDate, isXS, onChange}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { classes  } = useStyles();

    const handleLeft = () => {
        onChange(dayjs(selectedDate).subtract(!isXS ? 7 : 1, "days"));
    }

    const handleRight = () => {
        onChange(dayjs(selectedDate).add(!isXS ? 7 : 1, "days"));
    }

    const handleOpen = (s: boolean) => () => {
        setIsOpen(s);
    }

    const handleDateChange = (date: TParsableDate) => {
        onChange(date);
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
                onOpen={handleOpen(true)}
                onClose={handleOpen(false)}
                open={isOpen}
                InputProps={{
                    style:{display: "none"}
                }}
                onAccept={handleDateChange}
                value={selectedDate}
            />
        </div>
    );
};