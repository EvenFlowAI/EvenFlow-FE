import React from 'react';
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {TArgCallback, TCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {ECardType, TServiceCard} from "../../../store/reducers/appointmentFrameReducer/types";
import {selectSubService} from "../../../store/reducers/appointmentFrameReducer/actions";
import {ReactComponent as TireIcon} from "../../../assets/img/tire-rotation-icon.svg";
import {ReactComponent as WorksIcon} from "../../../assets/img/oil-icon.svg";
import {ReactComponent as RecallIcon} from "../../../assets/img/recall.svg";
import {ReactComponent as MoreIcon} from "../../../assets/img/tell-more.svg";
import {CardsWrapper} from "./styled";
import {ServiceCard} from "./ServiceCard";

const cards: TServiceCard[] = [
    {
        name: "engineLight",
        label: "Engine Light On",
        icon: <TireIcon />,
        type: ECardType.Maintenance
    },
    {
        name: "tireReplacement",
        label: "Tire Repair and Replacement",
        icon: <WorksIcon />,
        type: ECardType.Other
    },
    {
        name: "individual",
        label: "Search Individual Services",
        icon: <RecallIcon />,
        type: ECardType.Other
    },
    {
        name: "describe",
        label: "Describe What’s Going On",
        icon: <MoreIcon />,
        type: ECardType.TellMore
    },
]

type TProps = {
    onNext: TArgCallback<TScreen>;
    onBack: TCallback;
}
export const ServiceSelection: React.FC<TProps> = ({onNext, onBack}) => {
    const subService = useSelector((state: RootState) => state.appointmentFrame.subService);
    const dispatch = useDispatch();


    const handleSelectCard = (card: TServiceCard) => () => {
        dispatch(selectSubService(card));
    }

    const handleSubmit = () => {
        switch (subService?.name) {
            case "engineLight":
            case "tireReplacement":
            case "describe":
                return onNext('describeMore');
            case "individual":
                return onNext('opsCode');
            default:
                return;
        }
    }
    return (
        <StepWrapper>
            <CardsWrapper>
                {cards.map(card => {
                    return <ServiceCard
                        active={subService?.name === card.name}
                        onSelect={handleSelectCard(card)}
                        card={card}
                        key={card.name} />
                })}
            </CardsWrapper>
            <Actions
                nextDisabled={!subService}
                onNext={handleSubmit}
                onBack={onBack} />
        </StepWrapper>
    );
};