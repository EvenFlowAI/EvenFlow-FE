import React from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";

export const AppointmentConfirmationFrame: React.FC<TActionProps> = ({onBack, onNext}) => {
    return <StepWrapper>
        Confirmation
        <Actions onBack={onBack} onNext={onNext} />
    </StepWrapper>
};