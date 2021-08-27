import React from 'react';
import {StepWrapper} from "./StepWrapper";
import {styled} from "@material-ui/core";


const Wrapper = styled('div')({
    boxShadow: "1px 5px 15px rgba(0, 0, 0, 0.25);",
    padding: 20,
    display: "grid",
    minWidth: 545,
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px 8px",
    fontSize: 15,
    "& h2": {
        textTransform: "uppercase",
        gridColumnStart: 1,
        gridColumnEnd: 3,
        margin: "0 0 10px",
        padding: 0,
        fontSize: 19,
        textAlign: 'center'
    },
    "&>div": {
        textAlign: "right"
    },
    "&>.label": {
        textAlign: "left",
        textTransform: "uppercase",
        color: "#9FA2B4",
        fontWeight: "bold"
    }
});


export const AppointmentConfirmed = () => {
    return <StepWrapper>
        <Wrapper>
            <h2>Appointment Confirmed!</h2>
            <div className="label">Date and time</div>
            <div>Tue, Jul 21, 1:00 PM</div>
        </Wrapper>
    </StepWrapper>
};