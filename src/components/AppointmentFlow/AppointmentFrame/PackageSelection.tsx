import React from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";

export const PackageSelection: React.FC<TActionProps> = ({onBack, onNext}) => {
    return (
        <StepWrapper>
            <div>Package</div>
            <Actions onBack={onBack} onNext={onNext} />
        </StepWrapper>
    );
};