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
    clearCustomerCache, getBlankVehicle,
    getCustomerCache,
    loadSCProfile, loadSRs, selectSR,
    setCustomerLoadedData
} from "../../store/reducers/appointment/actions";
import {decodeSCID, getTracker} from "../../utils/utils";
import {AppointmentConfirmed} from "../AppointmentFlow/AppointmentFrame/AppointmentConfirmed";
import {VehicleData} from "../AppointmentFlow/AppointmentFrame/VehicleData";
import {API} from "../../api/api";
import {useException} from "../../utils/hooks";
import {
    setCurrentFrameScreen, setPackage, setTrackerCreated,
    setUpdateAppointment,
    setVehicle
} from "../../store/reducers/appointmentFrameReducer/actions";
import {CarDetails} from "../AppointmentFlow/AppointmentFrame/CarDetails";
import {ILoadedVehicle} from "../../api/types";
import './MaintenanceDetails.css';
import ReactGA from "react-ga";
import {LocalTokens} from "../../types/types";
import {v4 as uuidv4} from "uuid";
import {options} from "./EndUserLayout";

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

const SCREENS = {
    carSelection: 'Car Selection',
    serviceNeeds: 'Service Needs',
    packageSelection: 'Package Selection',
    maintenanceDetails: 'Car Details',
    carDetails: 'Car Details',
    consultantSelection: 'Consultant Selection',
    serviceSelection: 'Service Selection',
    describeMore: 'Describe More',
    appointmentConfirmation: 'Appointment Confirmation',
    appointmentSelection: 'Appointment Selection',
    appointmentConfirmed: 'Appointment Confirmed',
    appointmentTiming: 'Appointment Timing',
    transportationNeeds: 'Transportation Needs',
    opsCode: "opsCode",
    vehicleData: 'vehicleData',
}

// todo add new parent links while go live with new dealerships

export const prodParentLinks = ['https://apps.evenflow.ai/', 'https://www.riverviewford.com/', "https://www.bmwofschererville.com/"];

export const AppointmentFrameLayout = () => {
    const [currentScreen, setCurrentScreen] = useState<TScreen>("carSelection");
    const [loadingCar, setLoadingCar] = useState<boolean>(false);

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));

    const {id} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const showError = useException();

    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);
    const currentFrameScreen = useSelector((state: RootState) => state.appointmentFrame.currentScreen);
    const {selectedVehicle, trackerCreated, isAdditionalServices} = useSelector((state: RootState) => state.appointmentFrame);

    function createTracker(opt_clientId = '', origin = '', trackerCreated: boolean) {
        const TRACKER = getTracker(origin);
        if (!trackerCreated) {
            if (opt_clientId) options.clientId = opt_clientId

            ReactGA.initialize(TRACKER, {
                debug: true,
                titleCase: false,
                gaOptions: options,
            });
            dispatch(setTrackerCreated(true));
        }
    }

    useEffect(() => {
        trackerCreated && ReactGA.ga('pageview', window.location.pathname + window.location.search);
    }, [trackerCreated])

    useEffect(() => {
        if (!trackerCreated) {
            window.addEventListener('message', function(event) {
                if (!prodParentLinks.includes(event.origin)) return;
                let originSite = event.origin;
                if (window.location?.ancestorOrigins?.length) originSite = window.location.ancestorOrigins[0];
                if (originSite) createTracker(event.data, originSite, trackerCreated);
            });
        }
    }, [trackerCreated, window.location?.ancestorOrigins]);

    useEffect(() => {
        if (!trackerCreated) {
            setTimeout(() => {
                const url = (window.location != window.parent?.location)
                    ? document.referrer
                    : document.location.href;
                createTracker('', url, trackerCreated);
            }, 3000);
        }
    }, [window.location, document.referrer, document.location])

    useEffect(() => {
        if (!sessionStorage.getItem(LocalTokens.sessionId)) {
            const uid = uuidv4();
            sessionStorage.setItem(LocalTokens.sessionId, uid);
        }
        window.addEventListener('unload', () => {
            sessionStorage.setItem(LocalTokens.sessionId, '')
        })
    }, [sessionStorage])

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
                dispatch(setVehicle(getBlankVehicle()));
            } else {
                handleLogin();
            }
        }
    }, [customerLoadedData, dispatch, handleLogin]);

    useEffect(() => {
        if (currentFrameScreen) {
            setCurrentScreen(currentFrameScreen);
        }
        if (currentFrameScreen === currentScreen) {
            window.onbeforeunload = () => {
                ReactGA.event({
                    category: 'EvenFlow User',
                    action: 'Abandoned Page',
                    label: `From Page ${SCREENS[currentScreen]}`,
                    nonInteraction: true
                })
            }
        }
    }, [currentScreen, currentFrameScreen])

    useEffect(() => {
        dispatch(loadSCProfile(decodeSCID(id)));
        dispatch(loadSRs(decodeSCID(id)));
    }, [id, dispatch]);

    const handleChangeScreen = useCallback((name: TScreen) => () => {
        setCurrentScreen(name);
        dispatch(setCurrentFrameScreen(name));
    }, []);
    const handleSetScreen = useCallback((screen: TScreen) => {
        setCurrentScreen(screen);
        dispatch(setCurrentFrameScreen(screen));
    }, []);

    const handleAddNewVehicle = useCallback(() => {
        dispatch(setVehicle(getBlankVehicle()));
        handleSetScreen('serviceNeeds');
    }, [dispatch, handleSetScreen]);

    const handleAddNewCarAppointment = useCallback((vehicle: ILoadedVehicle) => {
        dispatch(setVehicle(vehicle));
        handleSetScreen('serviceNeeds');
    }, [dispatch, handleSetScreen]);

    const handleSelectCar = useCallback(async () => {
        if (selectedVehicle?.appointmentHashKeys.length) {
            const key = selectedVehicle.appointmentHashKeys[selectedVehicle.appointmentHashKeys.length-1];
            setLoadingCar(true);
            try {
                const {data} = await API.appointment.getByKey(key);
                dispatch(setUpdateAppointment(data));
                data.serviceRequests.forEach(item => dispatch(selectSR(item.id)));
                if (data.maintenancePackageOption) {
                    dispatch(setPackage(data.maintenancePackageOption))
                }
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
                onAddNew={handleAddNewVehicle}
                onAddNewCarAppointment={handleAddNewCarAppointment}
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
                onAddServices={handleChangeScreen('serviceNeeds')}
            />,
            describeMore: <AddInfo
                onBack={handleSetScreen}
                onNext={handleChangeScreen('consultantSelection')}
                onFillCar={handleChangeScreen(isAdditionalServices ? 'consultantSelection' : 'carDetails')}
                onAddServices={handleChangeScreen('serviceNeeds')}
            />,
            opsCode: <SelectOpsCode
                onBack={handleChangeScreen('serviceSelection')}
                onNext={handleSetScreen}
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
            />,
            carDetails: <CarDetails
                onBack={handleChangeScreen('describeMore')}
                onNext={handleChangeScreen('consultantSelection')}
            />
        }
        return carSelections[currentScreen];
    }, [
        currentScreen, handleChangeScreen, handleSetScreen, handleAddNewVehicle,
        handleLogin, handleSelectCar, loadingCar, handleAddNewCarAppointment
    ]);

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
                return "Please select your Maintenance Package"
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
            case "carDetails":
                return "Please tell us about your vehicle"
            default:
                return null;
        }
    }
    return (
        <MuiThemeProvider theme={frameTheme}>
            <Container>
                {isSm && !['carSelection', 'appointmentConfirmed', 'packageSelection'].includes(currentScreen)
                    ? <SideBar screen={currentScreen} handleSetScreen={handleSetScreen}/> : null}
                {!['carSelection', 'appointmentConfirmed'].includes(currentScreen)
                    ? <Title>{getTitle()}</Title> : null}
                {isXs && currentScreen === 'packageSelection'
                    ? <p style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 0}}>Please click on the maintenance package for your vehicle</p> : null}
                {currentScreen === 'maintenanceDetails'
                    ? <Subtitle>Please provide the maintenance details for your vehicle</Subtitle> : null}
                {['carSelection', 'packageSelection', 'appointmentConfirmed'].includes(currentScreen)
                    ? component
                    : !isSm ? <SidebarWrapper>
                        <SideBar screen={currentScreen} handleSetScreen={handleSetScreen}/>
                        {component}
                    </SidebarWrapper> : component
                }
            </Container>
        </MuiThemeProvider>
    );
};