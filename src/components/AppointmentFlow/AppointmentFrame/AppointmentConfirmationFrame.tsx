import React from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {UserData} from "./confirmationSections/UserData";
import {styled} from "@material-ui/core";

const Wrapper = styled('div')({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
})


export const AppointmentConfirmationFrame: React.FC<TActionProps> = ({onBack, onNext}) => {
    return <StepWrapper>
        <Wrapper>
            <UserData />
        </Wrapper>
        <Actions onBack={onBack} onNext={onNext} />
    </StepWrapper>
};