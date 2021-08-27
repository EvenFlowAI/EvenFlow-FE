import React from 'react';
import {TActionProps} from "./types";
import {Actions} from "./Actions";
import {StepWrapper} from "./StepWrapper";

export const SelectOpsCode: React.FC<TActionProps> = ({onNext, onBack}) => {
    return (
        <StepWrapper>
            <div>Ops Code</div>
            <Actions onBack={onBack} onNext={onNext} />
        </StepWrapper>
    );
};