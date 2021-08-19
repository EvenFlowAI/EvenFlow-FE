import React from 'react';
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {TArgCallback, TCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";

type TProps = {
    onNext: TArgCallback<TScreen>;
    onBack: TCallback;
}
export const ServiceSelection: React.FC<TProps> = ({onNext, onBack}) => {
    const handleSubmit = () => {
        // onNext('selectScreen')
    }
    return (
        <StepWrapper>
            <div>Select service</div>
            <Actions onBack={onBack} onNext={handleSubmit} />
        </StepWrapper>
    );
};