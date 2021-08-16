import React from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import { Actions } from './Actions';
import { styled } from '@material-ui/core';
import {ReactComponent as SelectDateIcon} from "../../../assets/img/selectDateIcon.svg";
import {ReactComponent as FirstAvailableIcon} from "../../../assets/img/firstAvailableIcon.svg";
import {ReactComponent as OffersIcon} from "../../../assets/img/offersIcon.svg";


const TimingWrapper = styled('div')({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    width: "100%",
    alignItems: "stretch",
    gap: "20px"
});
const CardWrapper = styled('div')({
    border: "1px solid #DADADA",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
});
type TCard = {
    description: string;
    name: string;
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

const TimingCard: React.FC<{card: TCard}> = ({card}) => {
    return <CardWrapper>
        {/*select*/}
        <div className="icon">{card.icon}</div>
        <div>{card.description}</div>
    </CardWrapper>
}

export const AppointmentTiming: React.FC<TActionProps> = ({onNext, onBack}) => {
    return (
        <StepWrapper>
            <TimingWrapper>
                {cards.map(card => {
                    return <TimingCard card={card} key={card.name} />
                })}
            </TimingWrapper>
            <Actions onBack={onBack} onNext={onNext} />
        </StepWrapper>
    );
};