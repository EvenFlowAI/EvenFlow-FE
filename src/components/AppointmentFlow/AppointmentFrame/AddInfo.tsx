import React from 'react';
import {TActionProps} from "./types";
import {Actions} from "./Actions";
import {StepWrapper} from "./StepWrapper";

export const AddInfo: React.FC<TActionProps> = ({onNext, onBack}) => {
    return (
        <StepWrapper>
            <div>AI</div>
            <Actions onBack={onBack} onNext={onNext} />
        </StepWrapper>
    );
};