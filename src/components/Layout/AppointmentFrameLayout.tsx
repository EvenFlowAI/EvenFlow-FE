import React, {useCallback, useMemo, useState} from 'react';
import {MuiThemeProvider, styled} from "@material-ui/core";
import {AppointmentCarSelection} from "../AppointmentFlow/AppointmentFrame/AppointmentCarSelection";
import {frameTheme} from "../../theme/theme";
import {TScreen} from "./types";
import {ServiceNeedsFrame} from "../AppointmentFlow/AppointmentFrame/ServiceNeedsFrame";
import {SideBar} from "../AppointmentFlow/AppointmentFrame/SideBar";
import {Subtitle, Title} from "../AppointmentFlow/AppointmentFrame/Title";
import {MaintenanceDetails} from "../AppointmentFlow/AppointmentFrame/MaintenanceDetails";
import { ConsultantSelection } from '../AppointmentFlow/AppointmentFrame/ConsultantSelection';

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
    width: "100%",
    marginTop: 28
});

export const AppointmentFrameLayout = () => {
    const [currentScreen, setCurrentScreen] = useState<TScreen>("carSelection");

    const handleChangeScreen = useCallback((name: TScreen) => () => {
        setCurrentScreen(name);
    }, []);

    const component = useMemo(() => {
        const carSelections: {[k in TScreen]: JSX.Element} = {
            carSelection: <AppointmentCarSelection onNext={() => setCurrentScreen('serviceNeeds')} />,
            serviceNeeds: <ServiceNeedsFrame
                onBack={handleChangeScreen('carSelection')}
                onSelect={handleChangeScreen('maintenanceDetails')} />,
            maintenanceDetails: <MaintenanceDetails
                onBack={handleChangeScreen('serviceNeeds')}
                onNext={handleChangeScreen('consultantSelection')}
            />,
            consultantSelection: <ConsultantSelection
                onBack={handleChangeScreen('maintenanceDetails')}
                onNext={handleChangeScreen('appointmentSelection')}
            />,
            appointmentSelection: <div />,
            appointmentConfirmation: <div />,
            transportationNeeds: <div />,
        }
        return carSelections[currentScreen];
    }, [currentScreen, handleChangeScreen]);
    const getTitle = () => {
        switch (currentScreen) {
            case "carSelection":
                return null;
            case "serviceNeeds":
            case "maintenanceDetails":
                return "How can we help you?";
            default:
                return null;
        }
    }
    return (
        <MuiThemeProvider theme={frameTheme}>
            <Container>
                {currentScreen !== 'carSelection'
                    ? <Title>{getTitle()}</Title> : null}
                {currentScreen === 'maintenanceDetails'
                    ? <Subtitle>Please provide the maintenance details for your vehicle</Subtitle> : null}
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