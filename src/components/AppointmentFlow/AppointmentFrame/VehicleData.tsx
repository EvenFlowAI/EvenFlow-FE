import React from 'react';
import {StepWrapper} from "./StepWrapper";
import {TActionProps} from "./types";
import {Actions} from "./Actions";

type TProps = {

}&TActionProps;
export const VehicleData: React.FC<TProps> = ({onNext, onBack}) => {
    return <StepWrapper>
        Type vehicle data
        <Actions onBack={onBack} onNext={onNext} />
    </StepWrapper>;
};