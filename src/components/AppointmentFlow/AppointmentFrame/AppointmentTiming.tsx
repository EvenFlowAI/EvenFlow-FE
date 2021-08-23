import React from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from './Actions';
import {styled, Theme} from '@material-ui/core';
import {ReactComponent as SelectDateIcon} from "../../../assets/img/selectDateIcon.svg";
import {ReactComponent as FirstAvailableIcon} from "../../../assets/img/firstAvailableIcon.svg";
import {ReactComponent as OffersIcon} from "../../../assets/img/offersIcon.svg";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {TArgCallback, TCallback} from "../../../types/types";
import {DatePicker} from "@material-ui/pickers";
import {DateRangeIcon} from "@material-ui/pickers/_shared/icons/DateRangeIcon";
import {ETiming} from "../../../store/reducers/appointmentFrameReducer/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {setTime, setTiming} from "../../../store/reducers/appointmentFrameReducer/actions";
import moment from "moment";


const TimingWrapper = styled('div')({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    width: "100%",
    alignItems: "stretch",
    gap: "20px"
});
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
const CardWrapper = styled('div')<Theme, {active?: boolean}>({
    border: "1px solid #DADADA",
    borderColor: ({active}) => active ? "#000000" : "#DADADA",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "20px",
    padding: 20,
    fontSize: 15,
    background: ({active}) => active ? "#E7E7E7" : "transparent",
    transition: "all .2s",
    cursor: "pointer",
    "& .icon": {
        borderRadius: "50%",
        background: ({active}) => active ? "#FFFFFF" : "#E7E7E7",
        width: 86,
        height: 86,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    "&>div:last-child": {
        marginTop: "auto"
    }
});
type TCard = {
    description: string;
    name: ETiming;
    icon: JSX.Element;
}
const cards: TCard[] = [
    {
        description: "See appointments with special offer and shorter wait times",
        icon: <OffersIcon />,
        name: ETiming.Offers
    },
    {
        description: "Choose a preferred date",
        icon: <SelectDateIcon />,
        name: ETiming.SelectDate
    },
    {
        description: "Choose first available date",
        icon: <FirstAvailableIcon />,
        name: ETiming.FirstAvailable
    }
];

type TCardProps = {
    card: TCard;
    active?: boolean;
    onClick: TCallback;
    selectedTime: moment.Moment|null;
    onChangeTime: TArgCallback<moment.Moment|null>;
}
const TimingCard: React.FC<TCardProps> = ({card, active, onClick,
                                              onChangeTime, selectedTime}) => {
    return <CardWrapper active={active} onClick={onClick}>
        {active ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
        <div className="icon">{card.icon}</div>
        {card.name === ETiming.SelectDate
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
            : null
        }
        <div>{card.description}</div>
    </CardWrapper>
}

export const AppointmentTiming: React.FC<TActionProps> = ({onNext, onBack}) => {
    const dispatch = useDispatch();
    const [selectedType, selectedTime] = useSelector(
        (state: RootState) => [
            state.appointmentFrame.selectedTiming,
            state.appointmentFrame.selectedTime
        ]
    );

    const handleSelectTiming = (t: ETiming) => () => {
        dispatch(setTiming(t));
    }
    const handleChangeTime = (t: moment.Moment|null) => {
        dispatch(setTime(t));
    }

    const isValid = Boolean(selectedType !== null && (selectedType !== ETiming.SelectDate || selectedTime));

    return (
        <StepWrapper>
            <TimingWrapper>
                {cards.map((card) => {
                    return <TimingCard
                        onClick={handleSelectTiming(card.name)}
                        card={card}
                        onChangeTime={handleChangeTime}
                        selectedTime={selectedTime}
                        active={selectedType === card.name}
                        key={card.name} />
                })}
            </TimingWrapper>
            <Actions onBack={onBack} onNext={onNext} nextDisabled={!isValid} />
        </StepWrapper>
    );
};