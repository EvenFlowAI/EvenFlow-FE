import React, {useMemo, useState} from 'react';
import {MuiThemeProvider, styled} from "@material-ui/core";
import {AppointmentCarSelection} from "../AppointmentFlow/AppointmentFrame/AppointmentCarSelection";
import {frameTheme} from "../../theme/theme";
import {TScreen} from "./types";
import {ServiceNeedsFrame} from "../AppointmentFlow/AppointmentFrame/ServiceNeedsFrame";
import {SideBar} from "../AppointmentFlow/AppointmentFrame/SideBar";
import {Title} from "../AppointmentFlow/AppointmentFrame/Title";

const Container = styled('div')({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "100%",
    padding: 20,
    maxWidth: 1280,
    margin: "auto"
});
const SidebarWrapper = styled('div')({
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    gap: "20px",
    alignItems: "flex-start",
    width: "100%"
});

export const AppointmentFrameLayout = () => {
    const [currentScreen, setCurrentScreen] = useState<TScreen>("carSelection");
    const component = useMemo(() => {
        const carSelections: {[k in TScreen]: JSX.Element} = {
            carSelection: <AppointmentCarSelection onNext={() => setCurrentScreen('serviceNeeds')} />,
            serviceNeeds: <ServiceNeedsFrame />,
            appointmentSelection: <div />,
            appointmentConfirmation: <div />,
            transportationNeeds: <div />,
            consultantSelection: <div />
        }
        return carSelections[currentScreen];
    }, [currentScreen]);
    const getTitle = () => {
        switch (currentScreen) {
            case "carSelection":
                return null;
            case "serviceNeeds":
                return "How can we help you?";
            default:
                return null;
        }
    }
    return (
        <MuiThemeProvider theme={frameTheme}>
            <Container>
                {currentScreen !== 'carSelection' ? <Title>{getTitle()}</Title> : null}
                {currentScreen === 'carSelection'
                    ? component
                    : <SidebarWrapper>
                        <SideBar screen={currentScreen} />
                        {component}
                    </SidebarWrapper>
                }
            </Container>
        </MuiThemeProvider>
    );
};