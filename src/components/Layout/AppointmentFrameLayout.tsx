import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {MuiThemeProvider, styled, useMediaQuery, useTheme} from "@material-ui/core";
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
import {SelectOpsCode} from "../AppointmentFlow/AppointmentFrame/SelectOpsCode";
import {Routes} from "../../config/routes";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {
    clearCustomerCache,
    getCustomerCache,
    loadSCProfile,
    setCustomerLoadedData
} from "../../store/reducers/appointment/actions";
import {decodeSCID} from "../../utils/utils";
import {AppointmentConfirmed} from "../AppointmentFlow/AppointmentFrame/AppointmentConfirmed";
import {VehicleData} from "../AppointmentFlow/AppointmentFrame/VehicleData";
import {API} from "../../api/api";
import {useException} from "../../utils/hooks";
import {setUpdateAppointment} from "../../store/reducers/appointmentFrameReducer/actions";

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
const SidebarWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    gap: "20px",
    alignItems: "flex-start",
    width: "100%",
    marginTop: 28,
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: "1fr"
    }
}));

export const AppointmentFrameLayout = () => {
    const [currentScreen, setCurrentScreen] = useState<TScreen>("carSelection");
    const [loadingCar, setLoadingCar] = useState<boolean>(false);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    const {id} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const showError = useException();

    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);
    const selectedVehicle = useSelector((state: RootState) => state.appointmentFrame.selectedVehicle);

    const handleLogin = useCallback(() => {
        clearCustomerCache();
        dispatch(setCustomerLoadedData(null));
        history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
    }, [id, history, dispatch]);

    useEffect(() => {
        if (!customerLoadedData) {
            const data = getCustomerCache();
            if (data) {
                dispatch(setCustomerLoadedData(data));
            } else {
                handleLogin();
            }
        }
    }, [customerLoadedData, dispatch, handleLogin]);
    useEffect(() => {
        dispatch(loadSCProfile(decodeSCID(id)));
    }, [id, dispatch]);

    const handleChangeScreen = useCallback((name: TScreen) => () => {
        setCurrentScreen(name);
    }, []);
    const handleSetScreen = useCallback((screen: TScreen) => {
        setCurrentScreen(screen);
    }, []);

    const handleSelectCar = useCallback(async () => {
        if (selectedVehicle?.appointmentHashKeys.length) {
            const key = selectedVehicle.appointmentHashKeys[selectedVehicle.appointmentHashKeys.length-1];
            setLoadingCar(true);
            try {
                const {data} = await API.appointment.getByKey(key);
                dispatch(setUpdateAppointment(data));
                handleSetScreen('serviceNeeds');
            } catch (e) {
                showError(e);
            } finally {
                setLoadingCar(false);
            }

        } else {
            //TODO: clear slots data clearSelected();
            handleSetScreen('serviceNeeds');
        }
    }, [handleSetScreen, selectedVehicle, showError, dispatch]);


    const component = useMemo(() => {
        const carSelections: {[k in TScreen]: JSX.Element} = {
            carSelection: <AppointmentCarSelection
                onBack={handleLogin}
                loading={loadingCar}
                onNext={handleSelectCar} />,
            serviceNeeds: <ServiceNeedsFrame
                onLogin={handleLogin}
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
            opsCode: <SelectOpsCode
                onBack={handleChangeScreen('serviceSelection')}
                onNext={handleChangeScreen('consultantSelection')}
            />,
            vehicleData: <VehicleData
                onBack={handleChangeScreen('describeMore')}
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
                onChangeSlot={handleChangeScreen('appointmentSelection')}
                onNext={handleChangeScreen('appointmentConfirmed')}
            />,
            appointmentConfirmed: <AppointmentConfirmed
                onModify={handleChangeScreen("serviceNeeds")}
            />
        }
        return carSelections[currentScreen];
    }, [currentScreen, handleChangeScreen, handleSetScreen, handleLogin, handleSelectCar, loadingCar]);
    const getTitle = () => {
        switch (currentScreen) {
            case "carSelection":
                return null;
            case "maintenanceDetails":
            case "serviceNeeds":
            case "serviceSelection":
                return "How can we help you?";
            case "describeMore":
                return "Please describe what’s going on";
            case "opsCode":
                return "What does your car need?";
            case "packageSelection":
                return "Please select the maintenance package for your vehicle"
            case "consultantSelection":
                return "Do you have a preferred advisor?";
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
                {isSm && !['carSelection', 'appointmentConfirmed'].includes(currentScreen)
                    ? <SideBar screen={currentScreen} /> : null}
                {!['carSelection', 'appointmentConfirmed'].includes(currentScreen)
                    ? <Title>{getTitle()}</Title> : null}
                {currentScreen === 'maintenanceDetails'
                    ? <Subtitle>Please provide the maintenance details for your vehicle</Subtitle> : null}
                {['carSelection', 'packageSelection', 'appointmentConfirmed'].includes(currentScreen)
                    ? component
                    : !isSm ? <SidebarWrapper>
                        <SideBar screen={currentScreen} />
                        {component}
                    </SidebarWrapper> : component
                }
            </Container>
        </MuiThemeProvider>
    );
};