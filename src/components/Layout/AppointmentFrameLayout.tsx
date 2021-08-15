import React, {useMemo, useState} from 'react';
import {MuiThemeProvider, styled} from "@material-ui/core";
import {AppointmentCarSelection} from "../AppointmentFlow/AppointmentFrame/AppointmentCarSelection";
import {frameTheme} from "../../theme/theme";
import {TScreen} from "./types";
import {ServiceNeedsFrame} from "../AppointmentFlow/AppointmentFrame/ServiceNeedsFrame";

const Container = styled('div')({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
});

export const AppointmentFrameLayout = () => {
    const [currentScreen, setCurrentScreen] = useState<TScreen>("carSelection");
    const component = useMemo(() => {
        const carSelections: {[k in TScreen]: JSX.Element} = {
            carSelection: <AppointmentCarSelection onNext={() => setCurrentScreen('serviceNeeds')} />,
            serviceNeeds: <ServiceNeedsFrame />
        }
        return carSelections[currentScreen];
    }, [currentScreen]);
    return (
        <MuiThemeProvider theme={frameTheme}>
            <Container>
                {component}
            </Container>
        </MuiThemeProvider>
    );
};