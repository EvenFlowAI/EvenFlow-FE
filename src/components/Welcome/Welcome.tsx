import React, {useEffect, useMemo, useState} from 'react';

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
import {useCurrentUser, useException, useLayout, useModal} from "../../utils/hooks";
import {FrameWelcomeLayout} from "./FrameWelcomeLayout";
import {MuiThemeProvider, useMediaQuery, useTheme} from "@material-ui/core";
import {frameTheme} from "../../theme/theme";
import {
    clearAppointmentData, loadMakes,
    setCurrentFrameScreen,
    setServiceTypeOption,
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
import {IFirstScreenOption} from "../../store/reducers/serviceTypes/types";
import {loadCustomersByName} from "../../store/reducers/enhancedCustomerSearch/actions";
import {ServiceCenterSelector} from "../NavBar/ServiceCenterSelector";
import SelectServiceCenter from "./SelectServiceCenter";
import {frameSmStyles, frameStyles} from "../Layout/EndUserLayout";

export const Welcome = () => {
    const {scProfile, customerEnteredEmail, isProfileLoading} = useSelector((state: RootState) => state.appointment);
    const {welcomeScreenView, serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {isLoading} = useSelector((state: RootState) => state.customers);

    const [loading, setLoading] = useState<boolean>(false);
    const [customerFirstName, setCustomerFirstName] = useState<string>('');
    const [customerLastName, setCustomerLastName] = useState<string>('');
    const {t} = useTranslation();
    const {isOpen, onOpen, onClose} = useModal();
    const {onOpen: onOpenSearchResults, onClose: onCloseSearchResults, isOpen: isOpenSearchResults} = useModal();
    const {onOpen: onOpenNotFound, onClose: onCloseNotFound, isOpen: isOpenNotFound} = useModal();

    const {id} = useParams();
    const history = useHistory();
    const showError = useException();
    const isFrame = useLayout();
    const dispatch = useDispatch();
    const currentUser = useCurrentUser();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

    useEffect(() => {
       if (scProfile) {
           dispatch(loadFirstScreenOptionsByQuery(scProfile.id))
           dispatch(loadMakes(scProfile.id))
       }
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

    const listenToPopState = () => dispatch(setWelcomeScreenView("select"))

    useEffect(() => {
        if ((!id || !decodeSCID(id) && !scProfile?.id)) {
            window.location.href = "/";
        }
        window.addEventListener("popstate", listenToPopState);
        return () => window.removeEventListener("popstate", listenToPopState);
    }, [id, scProfile]);

    const redirect = () => {
        const route = isFrame ? Routes.EndUser.AppointmentFrame : Routes.EndUser.Appointment;
        if (id) {
            history.push(route.replace(":id", id));
        } else if (scProfile?.id) {
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

    const onLoadingSearchResults = (count: number) => {
        count > 0 ? onOpenSearchResults() : onOpenNotFound()
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
                if (currentUser && scProfile && (data.lastName || data.firstName)) {
                    setCustomerFirstName(data.firstName ?? '');
                    setCustomerLastName(data.lastName ?? '');
                    dispatch(loadCustomersByName(scProfile.id, onLoadingSearchResults, showError, data.firstName, data.lastName))
                } else {
                    dispatch(setCurrentFrameScreen("carSelection"));
                    redirect();
                }
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
            if (firstScreenOptions.length) {
                dispatch(setWelcomeScreenView("serviceSelect"))
            } else {
                redirect();
            }
        }
    }

    const onServiceTypeSelect = (serviceOption: IFirstScreenOption) => {
        if (serviceTypeOption?.id !== serviceOption.id) {
            dispatch(clearAppointmentData());
            dispatch(setSideBarSteps([]))
        }
        handleConfig(serviceOption.type);
        const nextScreen = serviceOption.type === EServiceType.VisitCenter ? 'serviceNeeds' : 'location';
        dispatch(setCurrentFrameScreen(nextScreen));
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
        if (firstScreenOptions.length === 1 && firstScreenOptions[0].type === EServiceType.VisitCenter) {
            dispatch(setServiceTypeOption(firstScreenOptions[0]));
        } else {
            if (firstScreenOptions.length > 1) {
                dispatch(setWelcomeScreenView('serviceSelect'))
            } else {
                createBlankCar()
                onComplete(serviceType, EUserType.New);
            }
        }
    }

    const getComponent = () => {
        switch (welcomeScreenView) {
            case "serviceCenterSelect":
                return <SelectServiceCenter/>
            case "search":
            case "serviceSelect":
                return <ServiceTypeSelect onComplete={onServiceTypeSelect} loading={loading}/>;
            case "select":
            default:
                return <CustomerSelect
                    onOpenSearchResults={onOpenSearchResults}
                    onCloseSearchResults={onCloseSearchResults}
                    isOpenSearchResults={isOpenSearchResults}
                    loading={loading || isLoading}
                    onComplete={onComplete}
                    handleNew={handleNew}
                    onOpenNotFound={onOpenNotFound}
                    onCloseNotFound={onCloseNotFound}
                    isOpenNotFound={isOpenNotFound}
                    firstName={customerFirstName}
                    lastName={customerLastName}
                    setFirstName={setCustomerFirstName}
                    setLastName={setCustomerLastName}
                />;
        }
    }

    const getTitle = (view: TView) => {
        return view === 'serviceCenterSelect'
            ? "Dealership name Network Service Centers"
            :  view === 'serviceSelect' ? t("Do you want to bring your car in") : null
    };
    const getSubTitle = (view: TView) => {
        return view === 'serviceSelect' ? t("Or use our mobile service?") : t("schedule service")
    };

    // todo uncomment language switcher

    return !scProfile || isProfileLoading
        ? <Loading/>
        : isFrame
            ? <MuiThemeProvider theme={frameTheme}>
                <ExistingCustomerError open={isOpen} onClose={onClose} onNext={handleNew}/>
                <FrameWelcomeLayout>
                    {/*<LanguageSwitcher/>*/}
                    {getComponent()}
                </FrameWelcomeLayout>
            </MuiThemeProvider>
            : <React.Fragment>
                <WelcomeLayout title={getTitle(welcomeScreenView)} subtitle={getSubTitle(welcomeScreenView)}>
                    {/*<LanguageSwitcher/>*/}
                    {getComponent()}
                    <ExistingCustomerError open={isOpen} onClose={onClose} onNext={handleNew}/>
                </WelcomeLayout>
            </React.Fragment>
};