import React, {useEffect, useRef} from 'react';
import {useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import moment from "moment";
import {EAppointmentTimingType} from "../../../../../store/reducers/appointment/types";
import {RadioButtonChecked, RadioButtonUnchecked} from "@mui/icons-material";
import {TArgCallback, TCallback} from "../../../../../types/types";
import {CardWrapper, MobileWrapper, StyledDate} from "./styles";
import {TCard} from "../types";
import {DateRangeIcon} from "@mui/x-date-pickers";

type TCardProps = {
    card: TCard;
    active?: boolean;
    onClick: TCallback;
    selectedTime: moment.Moment|null;
    onChangeTime: TArgCallback<moment.Moment|null>;
    isLoading: boolean;
}

const AppointmentTimingCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<TCardProps>>> = ({card, active, onClick,
                                              onChangeTime, selectedTime, isLoading}) => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('md'));
    const {t} = useTranslation();
    const {appointmentSlots} = useSelector((state: RootState) => state.appointment)
    const cardRef = useRef<HTMLDivElement|null>(null);
    const shouldDisableDate = (date: moment.Moment|null) => !appointmentSlots.find(item => moment(item.date).format("YYYY-MM-DD") === moment(date).format('YYYY-MM-DD'));

    useEffect(() => {
        if (cardRef?.current) cardRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
    }, [cardRef])

    const content = card.name === EAppointmentTimingType.PreferredDate
        ? <StyledDate
            value={selectedTime}
            onChange={onChangeTime}
            disabled={!active}
            placeholder={t("Choose here")}
            disablePast
            // shouldDisableDate={shouldDisableDate}
            InputProps={{
                disableUnderline: true,
                endAdornment: <DateRangeIcon color={active ? "primary" : "disabled"}/>
            }}
        />
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