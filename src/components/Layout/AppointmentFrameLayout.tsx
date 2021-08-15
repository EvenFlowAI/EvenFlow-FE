import React from 'react';
import {styled} from "@material-ui/core";
import {AppointmentCarSelection} from "../AppointmentFlow/AppointmentFrame/AppointmentCarSelection";

const Container = styled('div')({
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
})

export const AppointmentFrameLayout = () => {
    return (
        <Container>
            <AppointmentCarSelection />
        </Container>
    );
};