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
import { AppointmentTiming } from '../AppointmentFlow/AppointmentFrame/AppointmentTiming';
import { AppointmentSelection } from '../AppointmentFlow/AppointmentFrame/AppointmentSelection';
import { TransportationNeeds } from '../AppointmentFlow/AppointmentFrame/TransportationNeeds';
import { AppointmentConfirmationFrame } from '../AppointmentFlow/AppointmentFrame/AppointmentConfirmationFrame';
import {AddInfo} from "../AppointmentFlow/AppointmentFrame/AddInfo";
import {ServiceSelection} from "../AppointmentFlow/AppointmentFrame/ServiceSelection";
import {PackageSelection} from "../AppointmentFlow/AppointmentFrame/PackageSelection";

const Container = styled('div')({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minHeight: "100%",
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
    // TODO: Replace with carSelection
    const [currentScreen, setCurrentScreen] = useState<TScreen>("serviceNeeds");

    const handleChangeScreen = useCallback((name: TScreen) => () => {
        setCurrentScreen(name);
    }, []);
    const handleSetScreen = useCallback((screen: TScreen) => {
        setCurrentScreen(screen);
    }, []);

    const component = useMemo(() => {
        const carSelections: {[k in TScreen]: JSX.Element} = {
            carSelection: <AppointmentCarSelection onNext={() => setCurrentScreen('serviceNeeds')} />,
            serviceNeeds: <ServiceNeedsFrame
                onBack={handleChangeScreen('carSelection')}
                onSelect={handleSetScreen} />,
            serviceSelection: <ServiceSelection
                onBack={handleChangeScreen('serviceNeeds')}
                onNext={handleSetScreen}
            />,
            maintenanceDetails: <MaintenanceDetails
                onBack={handleChangeScreen('serviceNeeds')}
                onNext={handleChangeScreen('packageSelection')}
            />,
            packageSelection: <PackageSelection
                onBack={handleChangeScreen('maintenanceDetails')}
                onNext={handleChangeScreen('consultantSelection')}
            />,
            describeMore: <AddInfo
                onBack={handleChangeScreen('serviceNeeds')}
                onNext={handleChangeScreen('consultantSelection')}
            />,
            consultantSelection: <ConsultantSelection
                onBack={handleChangeScreen('serviceNeeds')}
                onNext={handleChangeScreen('appointmentTiming')}
            />,
            appointmentTiming: <AppointmentTiming
                onBack={handleChangeScreen('consultantSelection')}
                onNext={handleChangeScreen('appointmentSelection')}
            />,
            appointmentSelection: <AppointmentSelection
                onBack={handleChangeScreen('appointmentTiming')}
                onNext={handleChangeScreen('transportationNeeds')}
            />,
            transportationNeeds: <TransportationNeeds
                onBack={handleChangeScreen('appointmentSelection')}
                onNext={handleChangeScreen('appointmentConfirmation')}
            />,
            appointmentConfirmation: <AppointmentConfirmationFrame
                onBack={handleChangeScreen('transportationNeeds')}
                onNext={handleChangeScreen('appointmentConfirmation')}
            />
        }
        return carSelections[currentScreen];
    }, [currentScreen, handleChangeScreen, handleSetScreen]);
    const getTitle = () => {
        switch (currentScreen) {
            case "carSelection":
                return null;
            case "serviceNeeds":
            case "serviceSelection":
                return "How can we help you?";
            case "maintenanceDetails":
                return "Please provide the maintenance details for your vehicle"
            case "describeMore":
                return "Please describe what’s going on";
            case "packageSelection":
                return "Please select the maintenance package for your vehicle"
            case "consultantSelection":
                return "Do you have a preferred consultant?";
            case "appointmentTiming":
                return "When would you like your vehicle serviced?";
            case "appointmentSelection":
                return "Select Appointment date & time"
            case "transportationNeeds":
                return "Will you be waiting at the dealership?";
            case "appointmentConfirmation":
                return "Appointment Confirmation";
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