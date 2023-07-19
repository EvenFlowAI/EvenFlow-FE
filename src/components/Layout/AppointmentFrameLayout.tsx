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
    getBlankVehicle,
    getCustomerCache,
    selectSR,
    setCustomerLoadedData
} from "../../store/reducers/appointment/actions";
import {encodeSCID, getTracker} from "../../utils/utils";
import {AppointmentConfirmed} from "../AppointmentFlow/AppointmentFrame/AppointmentConfirmed";
import {VehicleData} from "../AppointmentFlow/AppointmentFrame/VehicleData";
import {API} from "../../api/api";
import {useException} from "../../utils/hooks";
import {
    updateRecalls, updatePackageOption,
    setCurrentFrameScreen,
    setServiceTypeOption,
    setSideBarSteps,
    setTrackerCreated,
    setUpdateAppointment,
    setVehicle,
    setWelcomeScreenView
} from "../../store/reducers/appointmentFrameReducer/actions";
import {IAppointmentByQuery, ILoadedVehicle, IServiceCategory} from "../../api/types";
import './MaintenanceDetails.css';
import ReactGA from "react-ga4";
// import ReactGA from "react-ga";
import {LocalTokens} from "../../types/types";
import {v4 as uuidv4} from "uuid";
import {options} from "./EndUserLayout";
import YourLocation from "../AppointmentFlow/AppointmentFrame/YourLocation";
import {EServiceType} from "../../store/reducers/appointmentFrameReducer/types";
import PaymentScreen from "../AppointmentFlow/AppointmentFrame/PaymentScreen";
import {useTranslation} from "react-i18next";
import OfferProductPage from "../AppointmentFlow/AppointmentFrame/OfferProductPage";
import {ServiceCenterSwitcher} from "../AppointmentFlow/AppointmentFrame/ServiceCenterSwitcher/ServiceCenterSwitcher";
import TagManager from "react-gtm-module";
import {TView} from "../Welcome/types";
import {getTrimmedKey, prodParentLinks, SCREENS} from "../AppointmentFlow/AppointmentFrame/utils";
import {IServiceRequestShort} from "../../store/reducers/serviceRequests/types";

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
    const {
        selectedVehicle,
        trackerCreated,
        valueService,
        currentScreen: currentFrameScreen,
        consultants,
        makes,
        serviceTypeOption,
        hashKey,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);

    const [currentScreen, setCurrentScreen] = useState<TScreen | TMobileScreen>("carSelection");
    const [loadingCar, setLoadingCar] = useState<boolean>(false);
    const [lastSelectedCategory, setLastSelectedCategory] = useState<IServiceCategory|null>(null);
    const [needToShowServiceTypes, setNeedToShowServiceTypes] = useState<boolean>(false)

    const {id} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const showError = useException();
    const {t} = useTranslation();

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

    const currentConfig = useMemo(() => {
        return config.find(item => item.serviceType?.toString() === serviceType?.toString());
    }, [config, serviceType])

    const onlyVisitCenterOptionExists = useMemo(() => firstScreenOptions.length === 1 && firstScreenOptions[0].type === EServiceType.VisitCenter,
        [firstScreenOptions])

    const onGoToFirstScreen = useCallback((screen: TView) => {
        dispatch(setWelcomeScreenView(screen))
        if (id) {
            history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
        } else if (scProfile?.id) {
            history.push(Routes.EndUser.Welcome + "/" + encodeSCID(scProfile?.id) + "?frame=1");
        }
    }, [id, history, dispatch, scProfile])

    const handleLogin = useCallback(() => {
        clearCustomerCache();
        dispatch(setCustomerLoadedData(null));
        onGoToFirstScreen("select");
    }, [onGoToFirstScreen]);

    const handleSetScreen = useCallback((screen: TScreen) => {
        setCurrentScreen(screen);
        dispatch(setCurrentFrameScreen(screen));
    }, []);

    const updateServiceTypeOption = useCallback((data:IAppointmentByQuery): boolean => {
        let needToShowService = needToShowServiceTypes;
        if (data.serviceTypeOption) {
            const optionExists = Boolean(firstScreenOptions.find(item => item.id === data.serviceTypeOption?.id))
            if (optionExists) {
                needToShowService = false;
                dispatch(setServiceTypeOption(data.serviceTypeOption));
            }
        }
        setNeedToShowServiceTypes(needToShowService)
        return needToShowService;
    }, [needToShowServiceTypes, firstScreenOptions])

    const goToServiceTypeSelection = useCallback(() => {
        if (needToShowServiceTypes) {
            setNeedToShowServiceTypes(false);
            dispatch(setWelcomeScreenView('serviceSelect'))
            history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
        }
    }, [history, needToShowServiceTypes])

    const updateServiceRequests = async (serviceRequests: IServiceRequestShort[]) => serviceRequests.forEach(item => dispatch(selectSR(item.id)));

    const onUpdateAppointment = useCallback(async(car: ILoadedVehicle) => {
        const key = car.appointmentHashKeys[car.appointmentHashKeys.length-1];
        const trimmedKey = getTrimmedKey(key);
        setLoadingCar(true);
        try {
            const {data} = await API.appointment.getByKey(trimmedKey);
            await dispatch(updateRecalls(data, id));
            await dispatch(setUpdateAppointment(data));
            await dispatch(updatePackageOption(data.maintenancePackageOption))
            await updateServiceRequests(data.serviceRequests);
            const shouldShowServiceSelection = updateServiceTypeOption(data);
            if (shouldShowServiceSelection) {
                goToServiceTypeSelection();
            } else {
                const isMobileOrPickUp = data.serviceTypeOption && data.serviceTypeOption?.type !== EServiceType.VisitCenter;
                handleSetScreen(isMobileOrPickUp ? 'location' : 'serviceNeeds');
            }
        } catch (e) {
            showError(e);
        } finally {
            setLoadingCar(false);
        }
    }, [handleSetScreen, showError, dispatch, firstScreenOptions, makes, scProfile,
        updateServiceTypeOption, needToShowServiceTypes, serviceTypeOption, id,
        updateRecalls, updatePackageOption, goToServiceTypeSelection])

    /** TRACKER CODE START **/

    function createTracker(opt_clientId = '', origin = '', trackerCreated: boolean) {
        const TRACKER = getTracker(origin);
        if (!trackerCreated) {
            if (opt_clientId) options.clientId = opt_clientId

            ReactGA.initialize(TRACKER, {
                gaOptions: options,
            });
            TagManager.initialize({
                gtmId: TRACKER
            })
            dispatch(setTrackerCreated(true));
        }
    }

    useEffect(() => {
        trackerCreated && ReactGA.ga('pageview', window.location.pathname + window.location.search);
    }, [trackerCreated])

    useEffect(() => {
        window.addEventListener('beforeunload', handleLogin)
        return () => window.removeEventListener('beforeunload', handleLogin)
    }, [handleLogin])

    useEffect(() => {
        if (!trackerCreated) {
            /** expects for the post message from the parent site in order to create tracker with right trackingID **/
            window.addEventListener('message', function(event) {
                if (!prodParentLinks.includes(event?.origin)) return;
                let originSite = event.origin;
                /** in some browsers checks the parent URL and use it like origin **/
                if (window.location?.ancestorOrigins?.length) originSite = window.location.ancestorOrigins[0];
                if (originSite) createTracker(event.data, originSite, trackerCreated);
            });
        }
    }, [trackerCreated, window.location?.ancestorOrigins]);

    useEffect(() => {
        if (!trackerCreated) {
            /** if there are not a message from the parent site, try to get tracker from the document`s props **/
            if (process.env.REACT_APP_ENV === "production") {
                setTimeout(() => {
                    const url = (window.location != window.parent?.location)
                        ? document.referrer
                        : document.location.href;
                    createTracker('', url, trackerCreated);
                }, 3000);
            } else {
                /**without origin (parent site URL) creates default tracker for current environment**/
                createTracker('', '', trackerCreated);
            }
        }
    }, [window.location, document.referrer, document.location])

    /** TRACKER CODE END **/

    useEffect(() => {
        if (!sessionStorage.getItem(LocalTokens.sessionId)) {
            const uid = uuidv4();
            sessionStorage.setItem(LocalTokens.sessionId, uid);
        }
        window.addEventListener('unload', () => {
            sessionStorage.setItem(LocalTokens.sessionId, '')
        })
    }, [sessionStorage])

    useEffect(() => {
        setNeedToShowServiceTypes(Boolean(firstScreenOptions.length) && !onlyVisitCenterOptionExists && !hashKey?.length);
    }, [firstScreenOptions, onlyVisitCenterOptionExists, hashKey])

    useEffect(() => {
        if (selectedVehicle && customerLoadedData) {
            if (customerLoadedData.fromSearchByName && customerLoadedData.isUpdating) {
                if (!selectedVehicle?.mileage) dispatch(setSideBarSteps([]));
                onUpdateAppointment(selectedVehicle).then()
            }
        }
    }, [customerLoadedData, selectedVehicle])

    useEffect(() => {
        if (!customerLoadedData) {
            const data = getCustomerCache();
            if (data) {
                dispatch(setCustomerLoadedData(data));
                dispatch(setVehicle(getBlankVehicle()));
            } else {
                if (!valueService) {
                    handleLogin()
                    const nextScreen = serviceTypeOption && serviceTypeOption?.type !== EServiceType.VisitCenter ? "location" : "serviceNeeds"
                    dispatch(setCurrentFrameScreen(nextScreen))
                }
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
    }, [serviceType, customerLoadedData, valueService])

    const handleChangeScreen = useCallback((name: TScreen) => () => {
        setCurrentScreen(name);
        dispatch(setCurrentFrameScreen(name));
    }, []);

    const component = useMemo(() => {
        const carSelections: {[k in TScreen]: JSX.Element} = {
            carSelection: <AppointmentCarSelection
                onBack={handleLogin}
                loading={loadingCar}
                setNeedToShowServiceSelection={setNeedToShowServiceTypes}
                needToShowServiceSelection={needToShowServiceTypes}
                handleSetScreen={handleSetScreen}
                onUpdateAppointment={onUpdateAppointment}
                currentConfig={currentConfig}/>,
            serviceNeeds: <ServiceNeedsFrame
                setLastSelectedCategory={setLastSelectedCategory}
                setNeedToShowServiceSelection={setNeedToShowServiceTypes}
                onBack={handleChangeScreen(serviceType === EServiceType.VisitCenter ? 'carSelection' : 'location')}
                onSelect={handleSetScreen} />,
            serviceSelection: <ServiceSelection
                setLastSelectedCategory={setLastSelectedCategory}
                onBack={handleChangeScreen('serviceNeeds')}
                onNext={handleSetScreen}
            />,
            maintenanceDetails: <MaintenanceDetails
                onBack={handleSetScreen}
                onNext={handleSetScreen}
                currentConfig={currentConfig}
            />,
            packageSelection: <PackageSelection
                currentConfig={currentConfig}
                onBack={handleChangeScreen('maintenanceDetails')}
                onNext={handleSetScreen}
                onAddServices={handleChangeScreen('serviceNeeds')}
            />,
            describeMore: <AddInfo
                handleSetScreen={handleSetScreen}
                currentConfig={currentConfig}
                onAddServices={handleChangeScreen('serviceNeeds')}
            />,
            opsCode: <SelectOpsCode
                onAddServices={handleChangeScreen('serviceNeeds')}
                handleSetScreen={handleSetScreen}
            />,
            vehicleData: <VehicleData
                onBack={handleChangeScreen('describeMore')}
                currentConfig={currentConfig}
                onNext={handleSetScreen}
            />,
            consultantSelection: <ConsultantSelection
                onBack={handleChangeScreen('serviceNeeds')}
                onNext={handleChangeScreen(currentConfig?.appointmentSelection ? 'appointmentTiming' : "appointmentSelection")}
            />,
            appointmentTiming: <AppointmentTiming
                onBack={handleChangeScreen(currentConfig?.advisorSelection && consultants.length ? 'consultantSelection' : 'serviceNeeds')}
                onNext={handleChangeScreen('appointmentSelection')}
            />,
            appointmentSelection: <AppointmentSelection
                handleSetScreen={handleSetScreen}
                currentConfig={currentConfig}
            />,
            transportationNeeds: <TransportationNeeds
                onBack={handleChangeScreen('appointmentSelection')}
                onNext={handleChangeScreen('appointmentConfirmation')}
            />,
            appointmentConfirmation: <AppointmentConfirmationFrame
                onBack={handleChangeScreen(currentConfig?.transportationNeeds && !serviceTypeOption?.transportationOption
                    ? 'transportationNeeds'
                    : 'appointmentSelection')}
                onChangeSlot={handleChangeScreen('appointmentSelection')}
                onNext={handleChangeScreen('appointmentConfirmed')}
            />,
            appointmentConfirmed: <AppointmentConfirmed
                onModify={handleChangeScreen("serviceNeeds")}
            />,
            location: <YourLocation
                onBack={handleChangeScreen('carSelection')}
                onNext={handleChangeScreen('serviceNeeds')}
                setNeedToShowServiceSelection={setNeedToShowServiceTypes}
                onGoToFirstScreen={onGoToFirstScreen}
            />,
            payment: <PaymentScreen/>,
            serviceOfferProductPage: <OfferProductPage
                handleSetScreen={handleSetScreen}
                category={lastSelectedCategory}
                lastCategory={lastSelectedCategory}
                onChangeVehicle={handleChangeScreen('maintenanceDetails')}
            />,
        }
        return carSelections[currentScreen];
    }, [currentScreen, handleChangeScreen, handleSetScreen, handleLogin, loadingCar, serviceTypeOption, needToShowServiceTypes, onUpdateAppointment]);

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
                <ServiceCenterSwitcher/>
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