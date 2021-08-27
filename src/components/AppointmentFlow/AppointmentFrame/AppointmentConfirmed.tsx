import React from 'react';
import {StepWrapper} from "./StepWrapper";
import {styled} from "@material-ui/core";


const Wrapper = styled('div')({
    boxShadow: "1px 5px 15px rgba(0, 0, 0, 0.25);",
    padding: 20,
    "& h2": {
        textTransform: "uppercase",
        margin: 0,
        padding: 0
    }
})

export const AppointmentConfirmed = () => {
    return <StepWrapper>
        <Wrapper>
            <h2>Appointment Confirmed!</h2>
        </Wrapper>
    </StepWrapper>
};