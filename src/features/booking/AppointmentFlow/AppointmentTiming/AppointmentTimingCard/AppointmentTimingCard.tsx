import React, {useEffect, useRef} from 'react';
import {useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import moment from "moment";
import {EAppointmentTimingType} from "../../../../../store/reducers/appointment/types";
import {RadioButtonChecked, RadioButtonUnchecked} from "@mui/icons-material";
import {TArgCallback, TCallback, TParsableDate} from "../../../../../types/types";
import {CardWrapper, MobileWrapper, StyledDate} from "./styles";
import {TCard} from "../types";
import {DateRangeIcon} from "@mui/x-date-pickers";
import dayjs from "dayjs";

type TCardProps = {
    card: TCard;
    active?: boolean;
    onClick: TCallback;
    selectedTime: moment.Moment|null;
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
    const shouldDisableDate = (date: TParsableDate) => !appointmentSlots.find(item => moment(item.date).format("YYYY-MM-DD") === dayjs(date).format('YYYY-MM-DD'));

    useEffect(() => {
        if (cardRef?.current) cardRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
    }, [cardRef])

    const content = card.name === EAppointmentTimingType.PreferredDate
        ? <StyledDate
            value={dayjs(selectedTime?.toDate())}
            onChange={onChangeTime}
            disablePast
            format="MMMM, DD"
            shouldDisableDate={shouldDisableDate}
            InputProps={{
                endAdornment: <DateRangeIcon color={active ? "primary" : "disabled"}/>,
                placeholder: t("Choose here"),
                disabled: !active
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