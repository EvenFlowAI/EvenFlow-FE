import React from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from './StepWrapper';
import {styled, Theme} from "@material-ui/core";
import {ReactComponent as TireIcon} from "../../../assets/img/tire-rotation-icon.svg";
import {ReactComponent as WorksIcon} from "../../../assets/img/oil-icon.svg";
import {ReactComponent as RecallIcon} from "../../../assets/img/recall.svg";
import {ReactComponent as MoreIcon} from "../../../assets/img/tell-more.svg";
import {TArgCallback, TCallback} from "../../../types/types";
import {ECardType, TServiceCard} from "../../../store/reducers/appointmentFrameReducer/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {selectService} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TScreen} from "../../Layout/types";


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
    transition: "all .2s",
    background: ({active}) => active ? '#000000' : "transparent",
    color: ({active}) => active ? "#FFFFFF" : "#252733",
    border: ({active}) => `1px solid ${active ? '#000000' : '#DADADA'}`,
    fontSize: 24,
    textAlign: "center",
    alignItems: "center",
    padding: 10,
    cursor: "pointer",
});

const cards: TServiceCard[] = [
    {
        name: "FoD",
        label: "Factory or Dealer Scheduled Maintenance",
        icon: <TireIcon />,
        type: ECardType.Maintenance
    },
    {
        name: "QLC",
        label: "The Works Quick Lane Checkup",
        icon: <WorksIcon />,
        type: ECardType.Other
    },
    {
        name: "R",
        label: "Recall",
        icon: <RecallIcon />,
        type: ECardType.Other
    },
    {
        name: "TM",
        label: "Tell us more",
        icon: <MoreIcon />,
        type: ECardType.TellMore
    },
]

type TSCProps = {
    card: TServiceCard;
    onSelect: TCallback;
    active: boolean;
}
const ServiceCard: React.FC<TSCProps> = ({card, onSelect, active}) => {
    return <CardWrapper onClick={onSelect} active={active}>
        <span>{card.icon}</span>
        <span>{card.label}</span>
    </CardWrapper>
}

type TProps = {
    onSelect: TArgCallback<TScreen>;
    onBack: TCallback;
}
export const ServiceNeedsFrame: React.FC<TProps> = ({onSelect, onBack}) => {
    const selectedService = useSelector((state: RootState) => state.appointmentFrame.service);
    const dispatch = useDispatch();
    const handleSelectCard = (card: TServiceCard) => () => {
        dispatch(selectService(card));
    }
    const handleSubmit = () => {
        switch (selectedService?.name) {
            case "TM":
                return onSelect('serviceSelection');
            case "R":
            case "QLC":
                return onSelect('describeMore');
            case "FoD":
                return onSelect('maintenanceDetails');
            default:
                return;
        }
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
                onNext={handleSubmit}
                onBack={onBack} />
        </StepWrapper>
    );
};