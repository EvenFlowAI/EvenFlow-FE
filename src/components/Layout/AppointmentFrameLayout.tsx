import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {MuiThemeProvider, styled, useMediaQuery, useTheme} from "@material-ui/core";
import {AppointmentCarSelection} from "../AppointmentFlow/AppointmentFrame/AppointmentCarSelection";
import {frameTheme} from "../../theme/theme";
import {TMobileScreen, TScreen} from "./types";
import {ServiceNeedsFrame} from "../AppointmentFlow/AppointmentFrame/ServiceNeedsFrame";
import {SideBar} from "../AppointmentFlow/AppointmentFrame/SideBar";
import {Subtitle, Title} from "../AppointmentFlow/AppointmentFrame/Title";
import {MaintenanceDetails} from "../AppointmentFlow/AppointmentFrame/MaintenanceDetails";
import {ConsultantSelection} from '../AppointmentFlow/AppointmentFrame/ConsultantSelection';
import {AppointmentTiming} from '../AppointmentFlow/AppointmentFrame/AppointmentTiming';
import {AppointmentSelection} from '../AppointmentFlow/AppointmentFrame/AppointmentSelection';
import {TransportationNeeds} from '../AppointmentFlow/AppointmentFrame/TransportationNeeds';
import {AppointmentConfirmationFrame} from '../AppointmentFlow/AppointmentFrame/AppointmentConfirmationFrame';
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
    getBlankCustomer,
    getBlankVehicle,
    getCustomerCache,
    loadSCProfile,
    loadSRs,
    saveCustomerCache, selectAppointment,
    selectSR,
    setCustomerLoadedData
} from "../../store/reducers/appointment/actions";
import {decodeSCID, encodeSCID, getTracker} from "../../utils/utils";
import {AppointmentConfirmed} from "../AppointmentFlow/AppointmentFrame/AppointmentConfirmed";
import {VehicleData} from "../AppointmentFlow/AppointmentFrame/VehicleData";
import {API} from "../../api/api";
import {useException} from "../../utils/hooks";
import {
    selectCategoriesIds, selectService, selectSubService, setAdvisor,
    setCurrentFrameScreen,
    setPackage, setTiming,
    setTrackerCreated,
    setUpdateAppointment,
    setVehicle,
    setWelcomeScreenView
} from "../../store/reducers/appointmentFrameReducer/actions";
import {ILoadedVehicle, IServiceCategory} from "../../api/types";
import './MaintenanceDetails.css';
import ReactGA from "react-ga";
import {LocalTokens} from "../../types/types";
import {v4 as uuidv4} from "uuid";
import {options} from "./EndUserLayout";
import {EServiceCategoryType} from "../../store/reducers/categories/types";
import YourLocation from "../AppointmentFlow/AppointmentFrame/YourLocation";
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import PaymentScreen from "../AppointmentFlow/AppointmentFrame/PaymentScreen";
import {useTranslation} from "react-i18next";
import OfferProductPage from "../AppointmentFlow/AppointmentFrame/OfferProductPage";

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
    vehicleData: "vehicleData",
    location: "Your Location",
    payment: "payment",
    serviceOfferProductPage: "Service Offer Produce Page",
}

// todo add new parent links while go live with new dealerships

export const prodParentLinks = [
    'https://apps.evenflow.ai/',
    'https://www.riverviewford.com/',
    "https://www.bmwofschererville.com/",
    "https://bmw-schererville.evenflow.services",
    "https://www.fremontchryslerdodgejeepcasper.com",
    "https://www.fremontchryslerdodgejeeprocksprings.com",
    "https://www.janssenfordholdrege.com/",
    "https://www.janssenchryslerjeepdodge.com/",
    "https://www.lakepowellford.com/",
    "https://www.morrissmithfordoflarned.com/"
];

export const AppointmentFrameLayout = () => {
    const [currentScreen, setCurrentScreen] = useState<TScreen | TMobileScreen>("carSelection");
    const [loadingCar, setLoadingCar] = useState<boolean>(false);

    const {
        selectedVehicle,
        trackerCreated,
        isAdditionalServices,
        service,
        subService,
        valueService,
        serviceType,
        currentScreen: currentFrameScreen,
        isMobileServiceOn,
        isPickUpDropOffServiceOn,
        userType,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const [lastSelectedCategory, setLastSelectedCategory] = useState<IServiceCategory|null>(null);

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));

    const {id} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const showError = useException();
    const {t} = useTranslation();

    const isPromotionPage = useMemo(() => history.location.search?.includes("view=unique"), [history])
    const currentConfig = useMemo(() => {
        return config.find(item => item.serviceType.toString() === serviceType.toString());
    }, [config, serviceType])

    function createTracker(opt_clientId = '', origin = '', trackerCreated: boolean) {
        const TRACKER = getTracker(origin);
        if (!trackerCreated) {
            if (opt_clientId) options.clientId = opt_clientId

            ReactGA.initialize(TRACKER, {
                debug: false,
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
                if (!prodParentLinks.includes(event?.origin)) return;
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

    const handleNewCustomer = () => {
        const c = getBlankCustomer();
        dispatch(setCustomerLoadedData(c));
        dispatch(setVehicle(getBlankVehicle()));
        saveCustomerCache(c);
    }

    const handleLogin = useCallback(() => {
        clearCustomerCache();
        dispatch(setCustomerLoadedData(null));
        if (isPromotionPage) {
            handleNewCustomer();
            dispatch(setCurrentFrameScreen("serviceNeeds"));
        } else {
            dispatch(setWelcomeScreenView('select'))
            if (id) {
                history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
            } else if (scProfile?.id) {
                history.push(Routes.EndUser.Welcome + "/" + encodeSCID(scProfile?.id) + "?frame=1");
            }
        }
    }, [id, history, dispatch, scProfile]);

    useEffect(() => {
        if (!customerLoadedData) {
            const data = getCustomerCache();
            if (data) {
                dispatch(setCustomerLoadedData(data));
                dispatch(setVehicle(getBlankVehicle()));
            } else {
                if (!valueService) handleLogin();
            }
        }
    }, [customerLoadedData, dispatch, handleLogin]);

    useEffect(() => {
        if (currentFrameScreen === currentScreen) {
            window.onbeforeunload = () => {
                ReactGA.event({
                    category: 'EvenFlow User',
                    action: 'Abandoned Page',
                    label: `From Page ${SCREENS[currentScreen]}`,
                    nonInteraction: true
                })
            }
        } else {
            currentFrameScreen && setCurrentScreen(currentFrameScreen);
        }
    }, [currentScreen, currentFrameScreen])

    useEffect(() => {
        if (serviceType === EServiceType.MobileService && !customerLoadedData?.vehicles?.length && !valueService?.selectedService) {
            dispatch(setCurrentFrameScreen("location"))
            setCurrentScreen("location");
        }
    }, [serviceType, customerLoadedData])

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
        const needToShowServiceSelection = userType === EUserType.Existing && (isMobileServiceOn || isPickUpDropOffServiceOn);
        dispatch(setVehicle(getBlankVehicle()));
        dispatch(setPackage(null));
        dispatch(selectAppointment(null));
        dispatch(selectCategoriesIds([]));
        dispatch(selectService(null));
        dispatch(selectSubService(null));
        dispatch(setTiming(null));
        dispatch(setAdvisor(null));
        dispatch(selectSR(null));
        if (needToShowServiceSelection) {
            handleServiceTypeSelection()
        } else {
            handleSetScreen(serviceType === EServiceType.VisitCenter ? 'serviceNeeds' : 'location');
        }
    }, [dispatch, handleSetScreen]);

    const handleAddNewCarAppointment = useCallback((vehicle: ILoadedVehicle) => {
        dispatch(setVehicle(vehicle));
        handleSetScreen('serviceNeeds');
    }, [dispatch, handleSetScreen]);

    const getNextScreen = (): TScreen => {
        let nextScreen: TScreen = serviceType === EServiceType.VisitCenter ? 'serviceNeeds' : 'location';
        if (valueService?.selectedService) {
            nextScreen = currentConfig?.advisorSelection
                ? 'consultantSelection'
                : 'appointmentTiming'
        }
        return nextScreen;
    }

    const handleServiceTypeSelection = () => {
        dispatch(setWelcomeScreenView('serviceSelect'))
        history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
    }

    const handleSelectCar = useCallback(async () => {
        dispatch(selectSR(null));
        const needToShowServiceSelection = userType === EUserType.Existing && (isMobileServiceOn || isPickUpDropOffServiceOn);
        if (selectedVehicle?.appointmentHashKeys.length) {
            const key = selectedVehicle.appointmentHashKeys[selectedVehicle.appointmentHashKeys.length-1];
            const lastIndex = key.lastIndexOf('==');
            const trimmedKey = lastIndex > 0 ? key.slice(0, lastIndex).concat('==') : key;
            setLoadingCar(true);
            try {
                const {data} = await API.appointment.getByKey(trimmedKey);
                dispatch(setUpdateAppointment(data));
                data.serviceRequests.forEach(item => dispatch(selectSR(item.id)));
                if (data.maintenancePackageOption) {
                    dispatch(setPackage(data.maintenancePackageOption))
                }
                if (needToShowServiceSelection) {
                    handleServiceTypeSelection()
                } else {
                    handleSetScreen(serviceType === EServiceType.VisitCenter ? 'serviceNeeds' : 'location');
                }
            } catch (e) {
                showError(e);
            } finally {
                setLoadingCar(false);
            }
        } else {
            if (needToShowServiceSelection) {
                handleServiceTypeSelection()
            } else {
                handleSetScreen(getNextScreen());
            }
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
                setLastSelectedCategory={setLastSelectedCategory}
                onLogin={handleLogin}
                onBack={isPromotionPage
                    ? () => {}
                    : handleChangeScreen(serviceType === EServiceType.VisitCenter ? 'carSelection' : 'location')}
                onSelect={handleSetScreen} />,
            serviceSelection: <ServiceSelection
                setLastSelectedCategory={setLastSelectedCategory}
                onBack={handleChangeScreen('serviceNeeds')}
                onNext={handleSetScreen}
            />,
            maintenanceDetails: <MaintenanceDetails
                onBack={handleChangeScreen(
                    service?.type === EServiceCategoryType.Diagnose || subService?.type === EServiceCategoryType.IndividualServices
                        ? 'opsCode' : 'serviceNeeds')}
                onNext={handleChangeScreen(service?.type === EServiceCategoryType.MaintenancePackage
                    ? 'packageSelection'
                    : !currentConfig?.advisorSelection
                        ? 'appointmentTiming'
                        : 'consultantSelection')
                }
            />,
            packageSelection: <PackageSelection
                onBack={handleChangeScreen('maintenanceDetails')}
                onNext={handleChangeScreen(!currentConfig?.advisorSelection ? 'appointmentTiming' : 'consultantSelection')}
                onAddServices={handleChangeScreen('serviceNeeds')}
            />,
            describeMore: <AddInfo
                onBack={handleSetScreen}
                onNext={handleChangeScreen(!currentConfig?.advisorSelection ? 'appointmentTiming' : 'consultantSelection')}
                onFillCar={handleChangeScreen(isAdditionalServices
                    ? !currentConfig?.advisorSelection
                        ? 'appointmentTiming'
                        : 'consultantSelection'
                    : 'maintenanceDetails')}
                onAddServices={handleChangeScreen('serviceNeeds')}
            />,
            opsCode: <SelectOpsCode
                onAddServices={handleChangeScreen('serviceNeeds')}
                onBack={handleChangeScreen(service?.type === EServiceCategoryType.Diagnose
                || service?.type === EServiceCategoryType.IndividualServices
                    ? 'serviceNeeds'
                    : 'serviceSelection')}
                onNext={handleSetScreen}
            />,
            vehicleData: <VehicleData
                onBack={handleChangeScreen('describeMore')}
                onNext={handleChangeScreen(!currentConfig?.advisorSelection ? 'appointmentTiming' : 'consultantSelection')}
            />,
            consultantSelection: <ConsultantSelection
                onBack={handleChangeScreen('serviceNeeds')}
                onNext={handleChangeScreen('appointmentTiming')}
            />,
            appointmentTiming: <AppointmentTiming
                onBack={handleChangeScreen(!currentConfig?.advisorSelection ? 'serviceNeeds' : 'consultantSelection')}
                onNext={handleChangeScreen('appointmentSelection')}
            />,
            appointmentSelection: <AppointmentSelection
                onBack={handleChangeScreen('appointmentTiming')}
                onNext={handleChangeScreen(serviceType === EServiceType.VisitCenter ? 'transportationNeeds' : 'appointmentConfirmation')}
            />,
            transportationNeeds: <TransportationNeeds
                onBack={handleChangeScreen('appointmentSelection')}
                onNext={handleChangeScreen('appointmentConfirmation')}
            />,
            appointmentConfirmation: <AppointmentConfirmationFrame
                onBack={handleChangeScreen(serviceType === EServiceType.VisitCenter ? 'transportationNeeds' : 'appointmentSelection')}
                onChangeSlot={handleChangeScreen('appointmentSelection')}
                onNext={handleChangeScreen('appointmentConfirmed')}
            />,
            appointmentConfirmed: <AppointmentConfirmed
                onModify={handleChangeScreen("serviceNeeds")}
            />,
            // carDetails: <MaintenanceDetails
            //     onBack={handleChangeScreen(
            //         service?.type === EServiceCategoryType.Diagnose || subService?.type === EServiceCategoryType.IndividualServices
            //             ? 'opsCode' : 'serviceNeeds')}
            //     onNext={handleChangeScreen(service?.type === EServiceCategoryType.MaintenancePackage
            //         ? 'packageSelection'
            //         : !currentConfig?.advisorSelection
            //             ? 'appointmentTiming'
            //             : 'consultantSelection')
            //     }
            // />,
            location: <YourLocation
                onBack={handleChangeScreen('carSelection')}
                onNext={handleChangeScreen('serviceNeeds')}
                onLogin={handleLogin}
            />,
            payment: <PaymentScreen/>,
            serviceOfferProductPage: <OfferProductPage
                onBack={handleChangeScreen(service?.type === EServiceCategoryType.Diagnose
                || service?.type === EServiceCategoryType.IndividualServices
                    ? 'serviceNeeds'
                    : 'serviceSelection')}
                onNext={handleSetScreen}
                category={lastSelectedCategory}
                lastCategory={lastSelectedCategory}
                onChangeVehicle={handleChangeScreen('maintenanceDetails')}
            />,
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
                return t("How can we help you?");
            case "describeMore":
                return t("Please describe what’s going on");
            case "opsCode":
                return t("What does your car need?");
            case "packageSelection":
                return t("Please select your Maintenance Package")
            case "consultantSelection":
                return t("Do you have a preferred advisor?");
            case "appointmentTiming":
                return t("When would you like your vehicle serviced?");
            case "appointmentSelection":
                return t("Select Appointment date & time")
            case "transportationNeeds":
                return t("Do you need assistance with transportation?");
            case "appointmentConfirmation":
                return t("Appointment Confirmation Title");
            // case "carDetails":
            //     return t("Please tell us about your vehicle");
            case "location":
                return t("Where are you located?");
            case "payment":
                return t("Please Enter Your Payment Information");
            case "serviceOfferProductPage":
                return "Select Service With Special Offer";
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
                    ? <p style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 0}}>
                        {t("Please click on the maintenance package for your vehicle")}
                    </p>
                    : null}
                {currentScreen === 'maintenanceDetails'
                    ? <Subtitle>{t("Please provide the maintenance details for your vehicle")}</Subtitle> : null}
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