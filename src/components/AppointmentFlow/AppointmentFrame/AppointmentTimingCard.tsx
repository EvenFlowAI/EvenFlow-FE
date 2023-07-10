import React, {useEffect, useRef} from 'react';
import {styled, Theme, useMediaQuery, useTheme} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import moment from "moment";
import {EAppointmentTimingType} from "../../../store/reducers/appointment/types";
import {DateRangeIcon} from "@material-ui/pickers/_shared/icons/DateRangeIcon";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {DatePicker} from "@material-ui/pickers";
import {TArgCallback, TCallback} from "../../../types/types";
import {TCard} from "./types";

const StyledDate = styled(DatePicker)(({theme}) => ({
    marginTop: 16,
    cursor: "pointer",
    "&>div:not(.Mui-disabled)": {
        borderColor: theme.palette.primary.main,
        cursor: "pointer",
        "&>input": {
            color: theme.palette.primary.main,
            cursor: "pointer"
        }
    },
    "&>div": {
        paddingRight: 4,
        backgroundColor: "#fff"
    },
    [theme.breakpoints.down("xs")]: {
        marginTop: 0
    }
}))

const CardWrapper = styled(({active, ...props}) => <div {...props}/>)<Theme, {active?: boolean}>(({theme, active}) => ({
    border: "1px solid #DADADA",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    borderColor: active ? "#000000" : "#DADADA",
    background: active ? "#E7E7E7" : "transparent",
    gap: "20px",
    padding: 20,
    fontSize: 15,
    transition: "all .2s",
    cursor: "pointer",
    "& .icon": {
        borderRadius: "50%",
        width: 86,
        height: 86,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "#FFFFFF" : "#E7E7E7",
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    },
    "&>div:last-child": {
        marginTop: "auto",
    },
    [theme.breakpoints.down("sm")]: {
        flexDirection: "row",
    }
}));

const MobileWrapper = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    flexGrow: 1,
    flexDirection: "column",
    "&>div+div": {
        marginTop: 8
    }
})

type TCardProps = {
    card: TCard;
    active?: boolean;
    onClick: TCallback;
    selectedTime: moment.Moment|null;
    onChangeTime: TArgCallback<moment.Moment|null>;
    isLoading: boolean;
}

const AppointmentTimingCard: React.FC<TCardProps> = ({card, active, onClick,
                                              onChangeTime, selectedTime, isLoading}) => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
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