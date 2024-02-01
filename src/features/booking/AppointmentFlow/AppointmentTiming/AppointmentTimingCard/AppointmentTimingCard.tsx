import React, {useEffect, useRef} from 'react';
import {useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {EAppointmentTimingType} from "../../../../../store/reducers/appointment/types";
import {RadioButtonChecked, RadioButtonUnchecked} from "@mui/icons-material";
import {TArgCallback, TCallback, TParsableDate} from "../../../../../types/types";
import {CardWrapper, MobileWrapper, useStyles} from "./styles";
import {TCard} from "../types";
import {DateRangeIcon, MobileDatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import './AppointmentTimingCard.css';

type TCardProps = {
    card: TCard;
    active?: boolean;
    onClick: TCallback;
    selectedTime: TParsableDate;
    onChangeTime: TArgCallback<unknown>;
    isLoading: boolean;
}

const AppointmentTimingCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<TCardProps>>> = ({card, active, onClick,
                                              onChangeTime, selectedTime, isLoading}) => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('md'));
    const {t} = useTranslation();
    const {appointmentSlots} = useSelector((state: RootState) => state.appointment)
    const cardRef = useRef<HTMLDivElement|null>(null);
    const shouldDisableDate = (date: TParsableDate) => !appointmentSlots.find(item => dayjs.utc(item.date).format("YYYY-MM-DD") === dayjs.utc(date).format('YYYY-MM-DD'));
    const { classes } = useStyles();

    useEffect(() => {
        if (cardRef?.current) cardRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
    }, [cardRef])

    const content = card.name === EAppointmentTimingType.PreferredDate
        ? <div>
            <MobileDatePicker
                value={selectedTime}
                onChange={onChangeTime}
                disablePast
                // shouldDisableDate={shouldDisableDate}
                format="MMMM, DD"
                dayOfWeekFormatter={(day, date) => dayjs(date as TParsableDate).format("ddd")}
                slotProps={{
                    textField: {
                        InputProps: {
                            endAdornment: <DateRangeIcon color={active ? "primary" : "disabled"}/>,
                            placeholder: t("Choose here"),
                            disabled: !active,
                        },
                    },
                    toolbar: {
                        toolbarFormat: "ddd, MMM DD",
                    },
                    field: { className: classes.input },
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        "&:hover > fieldset": {borderColor: "#C7C8CD"},
                        borderRadius: 0,
                        border: 0,
                        borderImageWidth: 0,
                        outline: 'none',
                    },
                    "& .MuiOutlinedInput-input": {
                        padding: '9px'
                    },
                    "&.MuiInputBase-root": {
                        "&.Mui-focused": {
                            border: 0,
                            borderImageWidth: 0,
                            outline: 'none',
                        }
                    },
                    "& .MuiPickersToolbar-root": {
                        backgroundColor: 'red'
                    },
                    "& .MuiPickersLayout-toolbar": {
                        backgroundColor: 'red'
                    },
                    "& .MuiPickersLayout-root": {
                        backgroundColor: 'red'
                    }
                }}
            />
        </div>
        : null;

    return <CardWrapper onClick={onClick} active={active} ref={cardRef}>
        {active ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
        <div className="icon">{card.icon}</div>
        {!isSm
            ? <React.Fragment>
                {content}
                <div>{card.description}</div>
            </React.Fragment>
            : <MobileWrapper>
                {content}
                <div>{card.description}</div>
            </MobileWrapper>
        }
    </CardWrapper>
}

export default AppointmentTimingCard;