import React from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import { Actions } from './Actions';
import {styled} from "@material-ui/core";


const ConsultantWrapper = styled('div')({

})

export const ConsultantSelection: React.FC<TActionProps> = ({onNext, onBack}) => {
    return (<StepWrapper>
        <ConsultantWrapper>
            CW
        </ConsultantWrapper>
        <Actions onNext={onNext} onBack={onBack} />
    </StepWrapper>);
};