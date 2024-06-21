import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { ThemeProvider, StyledEngineProvider, useMediaQuery, useTheme } from "@mui/material";
import {Cars} from "../../../features/booking/AppointmentFlow/Cars/Cars";
import {frameTheme} from "../../../theme/theme";
import {ServiceNeedsFrame} from "../../../features/booking/AppointmentFlow/ServiceNeeds/ServiceNeedsFrame";
import {SideBar} from "../../../features/booking/SideBar/SideBar";
import {MaintenanceDetails} from "../../../features/booking/AppointmentFlow/MaintenanceDetails/MaintenanceDetails";
import {Consultants} from '../../../features/booking/AppointmentFlow/Consultants/Consultants';
import {AppointmentTiming} from '../../../features/booking/AppointmentFlow/AppointmentTiming/AppointmentTiming';
import {AppointmentSlots} from '../../../features/booking/AppointmentFlow/AppointmentSlots/AppointmentSlots';
import {
    TransportationNeeds
} from '../../../features/booking/AppointmentFlow/TransportationNeeds/TransportationNeeds';
import {
    AppointmentConfirmation
} from '../../../features/booking/AppointmentFlow/AppointmentConfirmation/AppointmentConfirmation';
import {AppointmentComment} from "../../../features/booking/AppointmentFlow/AppointmentComment/AppointmentComment";
import {
    MaintenancePackages
} from "../../../features/booking/AppointmentFlow/MaintenancePackages/MaintenancePackages";
import {SelectOpsCode} from "../../../features/booking/AppointmentFlow/ServiceOpsCodes/SelectOpsCode";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    clearCustomerCache,
    getBlankVehicle,
    getCustomerCache,
    selectSRMultiple,
    setCustomerLoadedData,
    setWaitListSettings
} from "../../../store/reducers/appointment/actions";
import {decodeSCID, encodeSCID} from "../../../utils/utils";
import {
    AppointmentConfirmed
} from "../../../features/booking/AppointmentFlow/AppointmentConfirmed/AppointmentConfirmed";
import {API} from "../../../api/api";
import {
    checkCarIsValid,
    handleSideBarAppointmentUpdate,
    loadConsultants,
    loadConsultantsForUpdating,
    loadMakes,
    setAnyAdvisorSelected,
    setAppointmentByKey,
    setAppointmentNotes,
    setAppointmentSaving,
    setCurrentFrameScreen,
    setServiceTypeOption,
    setTrackerCreated,
    setUpdateAppointment,
    setVehicle,
    setWelcomeScreenView,
    updateConsultant,
    updatePackageOption,
    updateRecalls
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {EServiceCategoryPage, IAppointmentByKey, ILoadedVehicle, IServiceCategory} from "../../../api/types";
import './AppointmentFlow.css';
import ReactGA from "react-ga4";
import YourLocation from "../../../features/booking/AppointmentFlow/YourLocation/YourLocation";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import PaymentScreen from "../../../features/booking/AppointmentFlow/PaymentScreen/PaymentScreen";
import {useTranslation} from "react-i18next";
import OfferProductPage from "../../../features/booking/AppointmentFlow/OfferProductPage/OfferProductPage";
import {ServiceCenterSwitcher} from "../../../features/booking/ServiceCenterSwitcher/ServiceCenterSwitcher";
import {IServiceRequestShort} from "../../../store/reducers/serviceRequests/types";
import {setTransportationAvailable} from "../../../store/reducers/bookingFlowConfig/actions";
import {IFirstScreenOption} from "../../../store/reducers/serviceTypes/types";
import {getCurrentUser} from "../../../store/reducers/users/actions";
import {loadEngineType, loadMileage} from "../../../store/reducers/vehicleDetails/actions";
import {ManageAppointment} from "../../../features/booking/AppointmentFlow/ManageAppointment/ManageAppointment";
import AskChangesCompleted from "../../../components/modals/booking/AskChangesCompleted/AskChangesCompleted";
import SlotImpactedWarning from "../../../components/modals/booking/SlotImpactedWarning/SlotImpactedWarning";
import ServiceImpactedWarning from "../../../components/modals/booking/ServiceImpactedWarning/ServiceImpactedWarning";
import SideBarSection from "../../../features/booking/SideBarSection/SideBarSection";
import {TMobileScreen, TScreen, TView} from "../../../types/types";
import {Container, SidebarWrapper} from "./styles";
import {AppointmentScreenTitle} from "../../../components/wrappers/AppointmentScreenTitle/AppointmentScreenTitle";
import {Subtitle} from "../../../components/wrappers/AppointmentScreenSubtitle/AppointmentScreenSubtitle";
import {SCREENS} from "../../../utils/constants";
import {useAnalyticsForParentSite} from "../../../hooks/useAnalyticsBySCId/useAnalyticsBySCId";
import {useStorage} from "../../../hooks/useStorage/useStorage";
import {useException} from "../../../hooks/useException/useException";
import {useCurrentUser} from "../../../hooks/useCurrentUser/useCurrentUser";
import {Routes} from "../../../routes/constants";

export const AppointmentFlow = () => {
    const {
        selectedVehicle,
        trackerData,
        valueService,
        currentScreen: currentFrameScreen,
        makes,
        serviceTypeOption,
        hashKey,
        selectedPackage,
        selectedRecalls,
        categoriesIds,
        address,
        zipCode,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData, scProfile, selectedSR} = useSelector((state: RootState) => state.appointment);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const {engineTypes, mileage} = useSelector((state: RootState) => state.vehicleDetails);
    const {currentConfig, isTransportationAvailable, isAppointmentTimingAvailable, isAdvisorAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);

    const [currentScreen, setCurrentScreen] = useState<TScreen | TMobileScreen>("carSelection");
    const [loadingCar, setLoadingCar] = useState<boolean>(false);
    const [lastSelectedCategory, setLastSelectedCategory] = useState<IServiceCategory|null>(null);
    const [needToShowServiceTypes, setNeedToShowServiceTypes] = useState<boolean>(false)
    const [serviceCategoryPage, setServiceCategoryPage] = useState<EServiceCategoryPage>(EServiceCategoryPage.Page1);

    const {id} = useParams<{id: string}>();
    const history = useHistory();
    const dispatch = useDispatch();
    const showError = useException();
    const currentUser = useCurrentUser();
    const {t} = useTranslation();

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('md'));
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

    const onlyVisitCenterOptionExists = useMemo(() => firstScreenOptions.length === 1 && firstScreenOptions[0].type === EServiceType.VisitCenter,
        [firstScreenOptions])

    const isAuth = useMemo(() => currentUser?.dealershipId === scProfile?.dealershipId, [currentUser, scProfile]);

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

    const handleTransportationScreen = (option:IFirstScreenOption) => {
        if (option.transportationOption) {
            dispatch(setTransportationAvailable(false));
        }
    }

    const handleServiceTypeOption = useCallback((data:IAppointmentByKey) => {
        let needToShowService = needToShowServiceTypes;
        if (data.serviceTypeOption) {
            const optionExists = Boolean(firstScreenOptions.find(item => item.id === data.serviceTypeOption?.id))
            if (optionExists) {
                needToShowService = false;
                dispatch(setServiceTypeOption(data.serviceTypeOption));
                handleTransportationScreen(data.serviceTypeOption);
            }
        }
        setNeedToShowServiceTypes(needToShowService)
    }, [needToShowServiceTypes, firstScreenOptions])

    const goToServiceTypeSelection = useCallback(() => {
        if (needToShowServiceTypes) {
            setNeedToShowServiceTypes(false);
            dispatch(setWelcomeScreenView('serviceSelect'))
            history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
        }
    }, [history, needToShowServiceTypes])

    const updateServiceRequests = async (serviceRequests: IServiceRequestShort[]) => {
        dispatch(selectSRMultiple(serviceRequests.map(el => el.id)));
    }

    const onUpdateAppointment = useCallback(async(car: ILoadedVehicle) => {
        const key = car.appointmentHashKeys[car.appointmentHashKeys.length-1];
        setLoadingCar(true);
        dispatch(setAppointmentSaving(true))
        setServiceCategoryPage(EServiceCategoryPage.Page1)
        if (key) {
            try {
                const {data} = await API.appointment.getByKey(key);
                if (isAuth) dispatch(setAppointmentNotes(data.notes ?? ''))
                const option = firstScreenOptions.find(item => item.id === data.serviceTypeOption?.id)
                if (data.waitlistTextSettings) {
                    dispatch(setWaitListSettings({
                        text: data.waitlistTextSettings.text ?? '',
                        textHex: data.waitlistTextSettings.textHex ?? ''
                    }))
                }
                dispatch(updateRecalls(data, id));
                dispatch(setUpdateAppointment(data));
                dispatch(setAppointmentByKey(data));
                dispatch(updatePackageOption(data.maintenancePackageOption))
                updateServiceRequests(data.serviceRequests);
                handleServiceTypeOption(data)
                dispatch(handleSideBarAppointmentUpdate());
                dispatch(loadConsultantsForUpdating(id, option ? option.id : null, data))
                dispatch(updateConsultant(data.advisor))
                dispatch(setAnyAdvisorSelected(data.advisor?.isAnySelected ?? true))
                dispatch(checkCarIsValid());
            } catch (e) {
                console.log(e)
                showError(e);
            } finally {
                setLoadingCar(false);
                dispatch(setAppointmentSaving(false))
            }
        }
    }, [handleSetScreen, showError, dispatch, firstScreenOptions, makes, scProfile,
        handleServiceTypeOption, needToShowServiceTypes, serviceTypeOption, id,
        updateRecalls, updatePackageOption, goToServiceTypeSelection,
        isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable,
        selectedVehicle, engineTypes, isAuth])

    const onCarIsValid = useCallback(() => {
        const someRequestsSelected = selectedSR.length || selectedPackage || categoriesIds.length || selectedRecalls.length;
        const requestDataIsValid = serviceTypeOption?.type === EServiceType.VisitCenter || Boolean(address && zipCode)
        if (someRequestsSelected && requestDataIsValid && !customerLoadedData?.isUpdating) {
            dispatch(loadConsultants(id, serviceTypeOption?.id ?? null));
        }
    }, [selectedSR, selectedPackage, categoriesIds, selectedRecalls, serviceTypeOption, id, address, zipCode, customerLoadedData])

    const setTracker = (ids: string[]) => dispatch(setTrackerCreated({isCreated: true, ids}))

    useAnalyticsForParentSite(id, trackerData.isCreated, setTracker);

    useStorage();

    useEffect(() => {
        dispatch(loadEngineType(decodeSCID(id)));
        dispatch(loadMakes(decodeSCID(id)));
    }, [id])

    useEffect(() => {
        dispatch(loadMileage(decodeSCID(id)));
    }, [id, selectedVehicle])


    useEffect(() => {
        dispatch(checkCarIsValid(onCarIsValid, undefined, true))
    }, [serviceTypeOption, id, selectedSR, selectedPackage, categoriesIds, selectedRecalls, selectedVehicle, mileage])

    useEffect(() => {
        window.addEventListener('beforeunload', handleLogin)
        return () => window.removeEventListener('beforeunload', handleLogin)
    }, [handleLogin])

    useEffect(() => {
        setNeedToShowServiceTypes(Boolean(firstScreenOptions.length) && !onlyVisitCenterOptionExists && !hashKey?.length);
    }, [firstScreenOptions, onlyVisitCenterOptionExists, hashKey])

    useEffect(() => {
        if (selectedVehicle && customerLoadedData?.isUpdating && customerLoadedData.fromSearchByName) {
            dispatch(setCustomerLoadedData({...customerLoadedData, fromSearchByName: false}))
            onUpdateAppointment(selectedVehicle).then(() => handleSetScreen("manageAppointment"))
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
                }, trackerData.ids)
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

    useEffect(() => {
        if (currentConfig && serviceTypeOption?.transportationOption) dispatch(setTransportationAvailable(false));
    }, [serviceTypeOption, currentConfig])

    useEffect(() => {
        dispatch(getCurrentUser(true))
    }, [])

    const handleChangeScreen = useCallback((name: TScreen) => () => {
        setCurrentScreen(name);
        dispatch(setCurrentFrameScreen(name));
    }, []);

    const component = useMemo(() => {
        const carSelections: {[k in TScreen]: JSX.Element} = {
            carSelection: <Cars
                onBack={handleLogin}
                loading={loadingCar}
                setNeedToShowServiceSelection={setNeedToShowServiceTypes}
                needToShowServiceSelection={needToShowServiceTypes}
                handleSetScreen={handleSetScreen}
                onUpdateAppointment={onUpdateAppointment}/>,
            serviceNeeds: <ServiceNeedsFrame
                page={serviceCategoryPage}
                setPage={setServiceCategoryPage}
                setLastSelectedCategory={setLastSelectedCategory}
                setNeedToShowServiceSelection={setNeedToShowServiceTypes}
                onBack={handleChangeScreen(serviceType === EServiceType.VisitCenter ? 'carSelection' : 'location')}
                onSelect={handleSetScreen} />,
            maintenanceDetails: <MaintenanceDetails
                serviceCategoryPage={serviceCategoryPage}
                onBack={handleSetScreen}
                onNext={handleSetScreen}
            />,
            packageSelection: <MaintenancePackages
                onBack={handleChangeScreen('maintenanceDetails')}
                onNext={handleSetScreen}
                onAddServices={handleChangeScreen('serviceNeeds')}
            />,
            describeMore: <AppointmentComment
                handleSetScreen={handleSetScreen}
                onAddServices={handleChangeScreen('serviceNeeds')}
            />,
            opsCode: <SelectOpsCode
                onAddServices={handleChangeScreen('serviceNeeds')}
                handleSetScreen={handleSetScreen}
                page={serviceCategoryPage}
            />,
            consultantSelection: <Consultants
                onBack={handleChangeScreen('serviceNeeds')}
                onNext={handleChangeScreen(isAppointmentTimingAvailable ? 'appointmentTiming' : "appointmentSelection")}
            />,
            appointmentTiming: <AppointmentTiming handleSetScreen={handleSetScreen}/>,
            appointmentSelection: <AppointmentSlots handleSetScreen={handleSetScreen}/>,
            transportationNeeds: <TransportationNeeds
                onBack={handleChangeScreen('appointmentSelection')}
                onNext={handleChangeScreen('appointmentConfirmation')}
            />,
            appointmentConfirmation: <AppointmentConfirmation
                onBack={handleChangeScreen(isTransportationAvailable && !serviceTypeOption?.transportationOption
                    ? 'transportationNeeds'
                    : 'appointmentSelection')}
                onChangeSlot={handleChangeScreen(isAppointmentTimingAvailable ? 'appointmentTiming' : "appointmentSelection")}
                onNext={handleChangeScreen('appointmentConfirmed')}
            />,
            appointmentConfirmed: <AppointmentConfirmed onUpdateAppointment={onUpdateAppointment}/>,
            location: <YourLocation
                onUpdateAppointment={onUpdateAppointment}
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
            manageAppointment: <ManageAppointment
                onUpdateAppointment={onUpdateAppointment}
                onChangeSlot={handleChangeScreen(isAppointmentTimingAvailable ? 'appointmentTiming' : "appointmentSelection")}/>,
        }
        return carSelections[currentScreen];

    }, [currentScreen, handleChangeScreen, handleSetScreen, handleLogin, loadingCar, serviceTypeOption,
        needToShowServiceTypes, onUpdateAppointment, serviceCategoryPage, isTransportationAvailable,
        isAdvisorAvailable, isAppointmentTimingAvailable]);

    const getTitle = () => {
        switch (currentScreen) {
            case "carSelection":
                return null;
            case "maintenanceDetails":
            case "serviceNeeds":
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
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={frameTheme}>
                <Container>
                    <ServiceCenterSwitcher/>
                    {isSm && !['carSelection', 'appointmentConfirmed', 'packageSelection'].includes(currentScreen)
                        ? <SideBar screen={currentScreen} handleSetScreen={handleSetScreen}/> : null}
                    {!['carSelection', 'appointmentConfirmed'].includes(currentScreen)
                        ? <AppointmentScreenTitle>{getTitle()}</AppointmentScreenTitle> : null}
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
                            <SideBarSection screen={currentScreen} handleSetScreen={handleSetScreen}/>
                            {component}
                        </SidebarWrapper> : component
                    }
                </Container>
                <AskChangesCompleted />
                <SlotImpactedWarning />
                <ServiceImpactedWarning/>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};