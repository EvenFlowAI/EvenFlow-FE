import React from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from './StepWrapper';
import {styled, Theme} from "@material-ui/core";
import tireIcon from "../../../assets/img/tire-rotation-icon.png";
import worksIcon from "../../../assets/img/oil-icon.png";
import recallIcon from "../../../assets/img/recallIcon.png";
import moreIcon from "../../../assets/img/tellUsMoreIcon.png";
import {TCallback} from "../../../types/types";
import {ECardType, TServiceCard} from "../../../store/reducers/appointmentFrameReducer/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {selectService} from "../../../store/reducers/appointmentFrameReducer/actions";


const CardsWrapper = styled("div")({
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    gap: "18px",
});

const CardWrapper = styled("div")<Theme, {active?: boolean}>({
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr 1fr",
    width: "100%",
    border: ({active}) => `1px solid ${active ? '#000000' : '#DADADA'}`,
    fontSize: 24,
    textAlign: "center",
    alignItems: "center",
    padding: 10,
    cursor: "pointer",
});

const cards: TServiceCard[] = [
    {name: "FoD", label: "Factory or Dealer Scheduled Maintenance", icon: tireIcon, type: ECardType.Maintenance},
    {name: "QLC", label: "The Works Quick Lane Checkup", icon: worksIcon, type: ECardType.Other},
    {name: "R", label: "Recall", icon: recallIcon, type: ECardType.Other},
    {name: "TM", label: "Tell us more", icon: moreIcon, type: ECardType.TellMore},
]

type TSCProps = {
    card: TServiceCard;
    onSelect: TCallback;
    active: boolean;
}
const ServiceCard: React.FC<TSCProps> = ({card, onSelect, active}) => {
    return <CardWrapper onClick={onSelect} active={active}>
        <span><img src={card.icon} alt={card.label}/></span>
        <span>{card.label}</span>
    </CardWrapper>
}

type TProps = {
    onSelect: TCallback;
    onBack: TCallback;
}
export const ServiceNeedsFrame: React.FC<TProps> = ({onSelect, onBack}) => {
    const selectedService = useSelector((state: RootState) => state.appointmentFrame.service);
    const dispatch = useDispatch();
    const handleSelectCard = (card: TServiceCard) => () => {
        dispatch(selectService(card));
    }
    return (
        <StepWrapper>
            <CardsWrapper>
                {cards.map(card => {
                    return <ServiceCard
                        active={selectedService?.name === card.name}
                        onSelect={handleSelectCard(card)}
                        card={card}
                        key={card.name} />
                })}
            </CardsWrapper>
            <Actions
                nextDisabled={!selectedService}
                onNext={onSelect}
                onBack={onBack} />
        </StepWrapper>
    );
};