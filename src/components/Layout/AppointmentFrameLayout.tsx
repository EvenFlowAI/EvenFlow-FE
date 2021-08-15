import React from 'react';
import {MuiThemeProvider, styled} from "@material-ui/core";
import {AppointmentCarSelection} from "../AppointmentFlow/AppointmentFrame/AppointmentCarSelection";
import {frameTheme} from "../../theme/theme";

const Container = styled('div')({
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
})

export const AppointmentFrameLayout = () => {
    return (
        <MuiThemeProvider theme={frameTheme}>
            <Container>
                <AppointmentCarSelection />
            </Container>
        </MuiThemeProvider>
    );
};