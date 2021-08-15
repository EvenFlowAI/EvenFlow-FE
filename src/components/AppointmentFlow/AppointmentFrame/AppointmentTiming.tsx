import React from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import { Actions } from './Actions';

export const AppointmentTiming: React.FC<TActionProps> = ({onNext, onBack}) => {
    return (
        <StepWrapper>
            Appointment timing
            <Actions onBack={onBack} onNext={onNext} />
        </StepWrapper>
    );
};