import React from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from './StepWrapper';
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
import {CardsWrapper} from "./styled";
import {ServiceCard} from "./ServiceCard";


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