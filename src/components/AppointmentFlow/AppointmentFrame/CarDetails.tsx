import React from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";

type TProps = {} & TActionProps;
export const CarDetails: React.FC<TProps> = ({onBack, onNext}) => {
    return <StepWrapper>
        <Actions onBack={onBack} onNext={onNext} />
    </StepWrapper>
};