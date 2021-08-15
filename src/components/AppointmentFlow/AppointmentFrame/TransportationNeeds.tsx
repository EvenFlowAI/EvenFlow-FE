import React from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import { Actions } from './Actions';
import {styled, Theme} from "@material-ui/core";

const CardWrapper = styled('div')<Theme, {active?: boolean}>({
    minHeight: 264,
    fontSize: 22,
    cursor: "pointer",
    fontWeight: 700,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    border: ({active}) => `1px solid ${active ? "#000000" : "#DADADA"}`,
    transition: "all .2s"
});

const TransportationWrapper = styled('div')({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px"
});

type TTransportation = string;
const transportationNeeds: TTransportation[] = [
    "Yes, I will be waiting",
    "No, I would like transportation options",
    "No, I would like vehicle pick up / drop off services"
];

type TTransportationProps = {
    transportation: TTransportation;
    active?: boolean;
}
const TransportationCard: React.FC<TTransportationProps> = ({transportation, active}) => {
    return <CardWrapper active={active}>
        {transportation}
    </CardWrapper>
}

export const TransportationNeeds: React.FC<TActionProps> = ({onNext, onBack}) => {
    return <StepWrapper>
        <TransportationWrapper>
            {transportationNeeds.map((t, idx) => {
                return <TransportationCard active={!idx} transportation={t} key={t} />
            })}
        </TransportationWrapper>
        <Actions onBack={onBack} onNext={onNext} />
    </StepWrapper>
};