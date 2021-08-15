import React from 'react';
import {Actions} from "./Actions";
import { StepWrapper } from './StepWrapper';
import {styled} from "@material-ui/core";
import tireIcon from "../../../assets/img/tire-rotation-icon.png";
import worksIcon from "../../../assets/img/oil-icon.png";
import recallIcon from "../../../assets/img/recallIcon.png";
import moreIcon from "../../../assets/img/tellUsMoreIcon.png";


const CardsWrapper = styled("div")({
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    gap: "18px",
});

const CardWrapper = styled("div")({
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr 1fr",
    width: "100%",
    border: "1px solid #DADADA",
    fontSize: 24,
    textAlign: "center",
    alignItems: "center",
    padding: 10,
});

type TCard = {
    label: string;
    icon: string;
}
const cards: TCard[] = [
    {label: "Factory or Dealer Scheduled Maintenance", icon: tireIcon},
    {label: "The Works Quick Lane Checkup", icon: worksIcon},
    {label: "Recall", icon: recallIcon},
    {label: "Tell us more", icon: moreIcon},
]

const ServiceCard: React.FC<{card: TCard}> = ({card}) => {
    return <CardWrapper>
        <span><img src={card.icon} alt={card.label}/></span>
        <span>{card.label}</span>
    </CardWrapper>
}

export const ServiceNeedsFrame = () => {
    return (
        <StepWrapper>
            <CardsWrapper>
                {cards.map(card => {
                    return <ServiceCard card={card} key={card.label} />
                })}
            </CardsWrapper>
            <Actions onNext={() => {}} onBack={() => {}} />
        </StepWrapper>
    );
};