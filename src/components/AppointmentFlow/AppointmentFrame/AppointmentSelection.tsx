import React from 'react';
import {TActionProps} from "./types";
import { StepWrapper } from './StepWrapper';
import { Actions } from './Actions';

export const AppointmentSelection: React.FC<TActionProps> = ({onBack, onNext}) => {
    return (
        <StepWrapper>
            Appointment selection
            <Actions onBack={onBack} onNext={onNext} />
        </StepWrapper>
    );
};