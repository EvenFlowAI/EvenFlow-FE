import React, {useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import { Actions } from './Actions';
import {styled, Theme} from '@material-ui/core';
import {ReactComponent as SelectDateIcon} from "../../../assets/img/selectDateIcon.svg";
import {ReactComponent as FirstAvailableIcon} from "../../../assets/img/firstAvailableIcon.svg";
import {ReactComponent as OffersIcon} from "../../../assets/img/offersIcon.svg";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {TCallback} from "../../../types/types";


const TimingWrapper = styled('div')({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    width: "100%",
    alignItems: "stretch",
    gap: "20px"
});
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
    }
});
type TCardName =
    | "offers"
    | "selectDate"
    | "firstAvailable";
type TCard = {
    description: string;
    name: TCardName;
    icon: JSX.Element;
}
const cards: TCard[] = [
    {
        description: "See appointments with special offer and shorter wait times",
        icon: <OffersIcon />,
        name: "offers"
    },
    {
        description: "Choose a preferred date",
        icon: <SelectDateIcon />,
        name: "selectDate"
    },
    {
        description: "Choose first available date",
        icon: <FirstAvailableIcon />,
        name: "firstAvailable"
    }
];

type TCardProps = {
    card: TCard;
    active?: boolean;
    onClick: TCallback;
}
const TimingCard: React.FC<TCardProps> = ({card, active, onClick}) => {
    return <CardWrapper active={active} onClick={onClick}>
        {active ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
        <div className="icon">{card.icon}</div>
        <div>{card.description}</div>
    </CardWrapper>
}

export const AppointmentTiming: React.FC<TActionProps> = ({onNext, onBack}) => {
    const [selected, setSelected] = useState<TCardName>("offers");
    return (
        <StepWrapper>
            <TimingWrapper>
                {cards.map((card) => {
                    return <TimingCard
                        onClick={() => setSelected(card.name)}
                        card={card}
                        active={selected === card.name} key={card.name} />
                })}
            </TimingWrapper>
            <Actions onBack={onBack} onNext={onNext} />
        </StepWrapper>
    );
};