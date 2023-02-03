import React, {useEffect, useState} from 'react';

import {CustomerSelect} from "./CustomerSelect";
import {useHistory, useParams} from 'react-router-dom';
import {Routes} from "../../config/routes";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {WelcomeLayout} from "./WelcomeLayout";
import {TView} from "./types";
import {
    clearStorage,
    getBlankCustomer,
    getBlankVehicle,
    saveAppointmentReducer,
    saveCustomerCache,
    setCustomerEnteredEmail,
    setCustomerLoadedData,
    setSessionId
} from "../../store/reducers/appointment/actions";
import {decodeSCID, encodeSCID} from "../../utils/utils";
import {useException, useLayout, useModal} from "../../utils/hooks";
import {FrameWelcomeLayout} from "./FrameWelcomeLayout";
import {MuiThemeProvider} from "@material-ui/core";
import {frameTheme} from "../../theme/theme";
import {
    clearAppointmentData,
    setCurrentFrameScreen,
    setServiceType, setServiceTypeOption,
    setSideBarSteps,
    setUserType,
    setValueServiceAvailability,
    setVehicle,
    setWelcomeScreenView
} from "../../store/reducers/appointmentFrameReducer/actions";
import {LocalTokens} from "../../types/types";
import {v4 as uuidv4} from "uuid";
import ServiceTypeSelect from "./ServiceTypeSelect";
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {API} from "../../api/api";
//import ReactGA from "react-ga4";
import ReactGA from "react-ga";
import {useTranslation} from "react-i18next";
import {ServiceCenterSwitcher} from "../AppointmentFlow/AppointmentFrame/ServiceCenterSwitcher/ServiceCenterSwitcher";
import ExistingCustomerError from "../Modals/ExistingCustomerError/ExistingCustomerError";
import {Loading} from "../UI/Loading";
import {loadFirstScreenOptionsByQuery} from "../../store/reducers/serviceTypes/actions";

export const Welcome = () => {
    const {scProfile, customerEnteredEmail, isProfileLoading} = useSelector((state: RootState) => state.appointment);
    const {isMobileServiceOn, isPickUpDropOffServiceOn, welcomeScreenView, serviceType} = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const { config } = useSelector((state: RootState) => state.bookingFlowConfig);

    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const {isOpen, onOpen, onClose} = useModal();

    const {id} = useParams();
    const history = useHistory();
    const showError = useException();
    const isFrame = useLayout();
    const dispatch = useDispatch();

    useEffect(() => {
        scProfile && dispatch(loadFirstScreenOptionsByQuery(scProfile.id))
    }, [scProfile])

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
        clearStorage();
    }, []);
    useEffect(() => {
        if ((!id || !decodeSCID(id) && !scProfile?.id)) {
            window.location.href = "/";
        }
    }, [id, scProfile]);

    const redirect = () => {
        const route = isFrame ? Routes.EndUser.AppointmentFrame : Routes.EndUser.Appointment;
        if (scProfile?.id) {
            history.push(route.replace(":id", encodeSCID(scProfile.id)));
        }
    }

    const handleConfig = (serviceType: EServiceType) => {
        const selectedServiceConfig = config.find(item => item.serviceType.toString() === serviceType.toString());
        if (selectedServiceConfig) dispatch(setValueServiceAvailability(selectedServiceConfig.valueService));
        dispatch(setSideBarSteps([]));
    }

    const handleGA = () => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Enters Page',
            label: `As Returning Customer`,
        });
    }

    const handleExistingUser = async () => {
        setLoading(true);
        try {
            const {data} = await API.appointment.searchCustomer({
                searchTerm: customerEnteredEmail,
                serviceCenterId: scProfile?.id ?? 0
            });
            dispatch(setCustomerLoadedData(data));
            dispatch(saveAppointmentReducer());
            if (data) {
                handleGA();
                dispatch(setCurrentFrameScreen("carSelection"));
                redirect();
            }
        } catch (err) {
            dispatch(setSessionId(""));
            if (err.response?.data?.errorCode === 6) {
                onOpen()
            } else showError(err)
        } finally {
            setLoading(false);
        }
    }

    const onComplete = async (serviceType: EServiceType, selectedUserType?: EUserType) => {
        handleConfig(serviceType);
        if (customerEnteredEmail && selectedUserType === EUserType.Existing) {
            handleExistingUser().then();
        } else {
            if ((isMobileServiceOn || isPickUpDropOffServiceOn) && firstScreenOptions.length) {
                dispatch(setWelcomeScreenView("serviceSelect"))
            } else {
                redirect();
            }
        }
    }

    const onServiceTypeSelect = (service: EServiceType) => {
        // todo service type from the appointment by key
        if (serviceType !== service) {
            dispatch(clearAppointmentData());
        }
        handleConfig(service);
        dispatch(setCurrentFrameScreen(service === EServiceType.VisitCenter ? 'serviceNeeds' : 'location'));
        redirect();
    }

    const createBlankCar = () => {
        const c = getBlankCustomer();
        dispatch(setCustomerLoadedData(c));
        dispatch(setVehicle(getBlankVehicle()));
        saveCustomerCache(c);
    }

    const handleReactGA = (userType: string) => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Enters Page',
            label: `As ${userType} Customer`,
        });
    }

    const handleNew = () => {
        dispatch(setUserType(EUserType.New));
        handleReactGA('A New');
        dispatch(setCustomerEnteredEmail(''));
        if (isMobileServiceOn || isPickUpDropOffServiceOn) {
            if (firstScreenOptions.length === 1 && firstScreenOptions[0].type === EServiceType.VisitCenter) {
                dispatch(setServiceType(EServiceType.VisitCenter))
                dispatch(setServiceTypeOption(firstScreenOptions[0]));
            } else if (firstScreenOptions.length > 1) {
                dispatch(setWelcomeScreenView('serviceSelect'))
            } else {
                createBlankCar()
                onComplete(serviceType, EUserType.New);
            }
        } else {
            createBlankCar()
            onComplete(serviceType, EUserType.New);
        }
    }

    const getComponent = () => {
        switch (welcomeScreenView) {
            case "search":
            case "serviceSelect":
                return <ServiceTypeSelect onComplete={onServiceTypeSelect} loading={loading}/>;
            case "select":
            default:
                return <CustomerSelect
                    loading={loading}
                    onComplete={onComplete}
                    handleNew={handleNew}
                />;
        }
    }

    const getTitle = (view: TView) => view === 'serviceSelect' ? t("Do you want to bring your car in") : t("welcome");
    const getSubTitle = (view: TView) => view === 'serviceSelect' ? t("Or use our mobile service?") : t("schedule service");

    // todo uncomment language switcher

    return !scProfile || isProfileLoading
        ? <Loading/>
        : isFrame
            ? <MuiThemeProvider theme={frameTheme}>
            <ExistingCustomerError open={isOpen} onClose={onClose} onNext={handleNew}/>
                <FrameWelcomeLayout>
                    {welcomeScreenView === "select" ? <ServiceCenterSwitcher/> : null}
                    {/*<LanguageSwitcher/>*/}
                    {getComponent()}
                </FrameWelcomeLayout>
            </MuiThemeProvider>
            : <WelcomeLayout title={getTitle(welcomeScreenView)} subtitle={getSubTitle(welcomeScreenView)}>
                {/*<LanguageSwitcher/>*/}
                {welcomeScreenView === "select" ? <ServiceCenterSwitcher/> : null}
                {getComponent()}
                <ExistingCustomerError open={isOpen} onClose={onClose} onNext={handleNew}/>
            </WelcomeLayout>
};