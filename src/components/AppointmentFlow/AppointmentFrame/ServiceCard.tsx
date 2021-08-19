import React from 'react';
import {TServiceCard} from "../../../store/reducers/appointmentFrameReducer/types";
import {TCallback} from "../../../types/types";
import {CardWrapper} from "./styled";

type TSCProps = {
    card: TServiceCard;
    onSelect: TCallback;
    active: boolean;
}
export const ServiceCard: React.FC<TSCProps> = ({card, onSelect, active}) => {
    return <CardWrapper onClick={onSelect} active={active}>
        <span>{card.icon}</span>
        <span>{card.label}</span>
    </CardWrapper>
}