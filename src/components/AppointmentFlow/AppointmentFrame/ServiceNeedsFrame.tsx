import React from 'react';
import {Actions} from "./Actions";
import { StepWrapper } from './StepWrapper';
import {styled} from "@material-ui/core";


const CardsWrapper = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "18px"
});

const CardWrapper = styled("div")({
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr 1fr",
    width: "100%",
    height: "100%",
    border: "1px solid #DADADA"
});

const ServiceCard = () => {
    return <CardWrapper>
        <span>icon</span>
        <span>Factory or Dealer Scheduled Maintenance</span>
    </CardWrapper>
}

export const ServiceNeedsFrame = () => {
    return (
        <StepWrapper>
            <CardsWrapper>
                <ServiceCard />
            </CardsWrapper>
            <Actions onNext={() => {}} onBack={() => {}} />
        </StepWrapper>
    );
};