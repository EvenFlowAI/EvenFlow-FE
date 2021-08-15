import React from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import { Actions } from './Actions';

export const TransportationNeeds: React.FC<TActionProps> = ({onNext, onBack}) => {
    return <StepWrapper>
        Transportation Needs
        <Actions onBack={onBack} onNext={onNext} />
    </StepWrapper>
};