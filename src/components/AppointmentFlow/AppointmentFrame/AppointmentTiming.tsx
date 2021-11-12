import React, {useCallback} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from './Actions';
import {styled, Theme, useMediaQuery, useTheme} from '@material-ui/core';
import {ReactComponent as SelectDateIcon} from "../../../assets/img/selectDateIcon.svg";
import {ReactComponent as FirstAvailableIcon} from "../../../assets/img/firstAvailableIcon.svg";
import {ReactComponent as OffersIcon} from "../../../assets/img/offersIcon.svg";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {TArgCallback, TCallback} from "../../../types/types";
import {DatePicker} from "@material-ui/pickers";
import {DateRangeIcon} from "@material-ui/pickers/_shared/icons/DateRangeIcon";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {setTime, setTiming} from "../../../store/reducers/appointmentFrameReducer/actions";
import moment from "moment";
import {EAppointmentTimingType} from "../../../store/reducers/appointment/types";
import {selectAppointment} from "../../../store/reducers/appointment/actions";
import ReactGA from "react-ga";


const TimingWrapper = styled('div')<Theme, {columns: number}>(({theme, columns}) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    width: "100%",
    alignItems: "stretch",
    gap: "20px",
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr"
    }
}));
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
const CardWrapper = styled('div')<Theme, {active?: boolean}>(({theme, active}) => ({
    border: "1px solid #DADADA",
    borderColor: active ? "#000000" : "#DADADA",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "20px",
    padding: 20,
    fontSize: 15,
    background: active ? "#E7E7E7" : "transparent",
    transition: "all .2s",
    cursor: "pointer",
    "& .icon": {
        borderRadius: "50%",
        background: active ? "#FFFFFF" : "#E7E7E7",
        width: 86,
        height: 86,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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

type TCard = {
    description: string;
    name: EAppointmentTimingType;
    icon: JSX.Element;
}
const cards: TCard[] = [
    {
        description: "See appointments with special offer and shorter wait times",
        icon: <OffersIcon />,
        name: EAppointmentTimingType.SpecialOffers
    },
    {
        description: "Choose a preferred date",
        icon: <SelectDateIcon />,
        name: EAppointmentTimingType.PreferredDate
    },
    {
        description: "Choose first available date",
        icon: <FirstAvailableIcon />,
        name: EAppointmentTimingType.FirstAvailable
    }
];

type TCardProps = {
    card: TCard;
    active?: boolean;
    onClick: TCallback;
    selectedTime: moment.Moment|null;
    onChangeTime: TArgCallback<moment.Moment|null>;
}

const timingTypes = ['Special Offers', 'Preferred Date', 'First Available Date'];

const TimingCard: React.FC<TCardProps> = ({card, active, onClick,
                                              onChangeTime, selectedTime}) => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const content = card.name === EAppointmentTimingType.PreferredDate
        ? <StyledDate
            value={selectedTime}
            onChange={onChangeTime}
            disabled={!active}
            placeholder={"Choose here"}
            disablePast
            InputProps={{
                disableUnderline: true,
                endAdornment: <DateRangeIcon color={active ? "primary" : "disabled"}/>
            }}
        />
        : null;
    return <CardWrapper active={active} onClick={onClick}>
        {active ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
        <div className="icon">{card.icon}</div>
        {!isSm
            ? <>
                {content}
                <div>{card.description}</div>
            </>
            : <MobileWrapper>
                {content}
                <div>{card.description}</div>
            </MobileWrapper>
        }

    </CardWrapper>
}

export const AppointmentTiming: React.FC<TActionProps> = ({onNext, onBack}) => {
    const dispatch = useDispatch();
    const [selectedType, selectedTime, appointment] = useSelector(
        (state: RootState) => [
            state.appointmentFrame.selectedTiming,
            state.appointmentFrame.selectedTime,
            state.appointment.appointment,
            // state.appointmentFrame.selectedPackage
        ]
    );

    const handleSelectTiming = (t: EAppointmentTimingType) => () => {
        dispatch(setTiming(t));
    }
    const handleChangeTime = (t: moment.Moment|null) => {
        dispatch(setTime(t));
        if (!moment(selectedTime).isSame(t, 'date')) {
            dispatch(selectAppointment(null));
        }
    }

    const isValid = Boolean(
        selectedType !== null
        && (selectedType !== EAppointmentTimingType.PreferredDate || selectedTime)
    );
    
    const onSubmit = useCallback((): void => {
        if (selectedType) {
            ReactGA.event({
                category: 'User',
                action: 'Selected Timing Type',
                label: `Selected ${timingTypes[selectedType]}`,
                nonInteraction: true
            });
        }
        if (appointment?.timingType !== selectedType) dispatch(selectAppointment(null))
        onNext();
    }, [appointment, dispatch, onNext, selectedType])

    return (
        <StepWrapper>
            {/*TODO: change to 3 after offers will be included */}
            <TimingWrapper columns={2}>
                {cards.map((card, idx) => {
                    /* TODO: Include again after Post MVP (Offers hidden) */
                    if (!idx) {return null;}
                    return <TimingCard
                        onClick={handleSelectTiming(card.name)}
                        card={card}
                        onChangeTime={handleChangeTime}
                        selectedTime={selectedTime}
                        active={selectedType === card.name}
                        key={card.name} />
                })}
            </TimingWrapper>
            <Actions onBack={onBack} onNext={onSubmit} nextDisabled={!isValid} />
        </StepWrapper>
    );
};