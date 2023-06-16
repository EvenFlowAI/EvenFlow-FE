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
    saveCustomerCache,
    setCustomerEnteredEmail,
    setCustomerLoadedData,
    setSessionId
} from "../../store/reducers/appointment/actions";
import {decodeSCID, encodeSCID} from "../../utils/utils";
import {useCurrentUser, useException, useLayout, useModal} from "../../utils/hooks";
import {FrameWelcomeLayout} from "./FrameWelcomeLayout";
import {MuiThemeProvider} from "@material-ui/core";
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
//import ReactGA from "react-ga4";
import ReactGA from "react-ga";
import {useTranslation} from "react-i18next";
import ExistingCustomerError from "../Modals/ExistingCustomerError/ExistingCustomerError";
import {Loading} from "../UI/Loading";
import {loadFirstScreenOptionsByQuery} from "../../store/reducers/serviceTypes/actions";
import {IFirstScreenOption} from "../../store/reducers/serviceTypes/types";
import {
    loadCustomersByPhoneOrEmail,
    loadCustomersBySearchTerm
} from "../../store/reducers/enhancedCustomerSearch/actions";
import SelectServiceCenter from "./SelectServiceCenter";

export const Welcome = () => {
    const {scProfile, customerEnteredEmail, isProfileLoading} = useSelector((state: RootState) => state.appointment);
    const {welcomeScreenView, serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {isLoading} = useSelector((state: RootState) => state.customers);
    const {shortLoading} = useSelector((state: RootState) => state.serviceCenters);

    const [loading, setLoading] = useState<boolean>(false);
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
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

    useEffect(() => {
       if (id) {
           dispatch(loadFirstScreenOptionsByQuery(decodeSCID(id)))
           dispatch(loadMakes(decodeSCID(id)))
       }
    }, [id])

    useEffect(() => {
        setLoading(isLoading || shortLoading || isProfileLoading)
    }, [isLoading, shortLoading, isProfileLoading])

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
        setLoading(false);
        count > 0 ? onOpenSearchResults() : onOpen()
    }

    const getDataForAdminUser = () => {
        try {
            dispatch(loadCustomersBySearchTerm(scProfile?.id ?? 0, onLoadingSearchResults, showError, '', '', customerEnteredEmail))
        } catch (err) {
            dispatch(setSessionId(""));
            setLoading(false);
            if (err.response?.data?.errorCode === 6) {
                onOpen()
            } else showError(err)
        } finally {
            setLoading(false);
        }
    }

    const onSuccessForCustomer = () => {
        setLoading(false);
        handleGA();
        redirect();
    }

    const getDataForCustomer = () => {
        try {
            dispatch(loadCustomersByPhoneOrEmail(scProfile?.id ?? 0, showError, customerEnteredEmail, onSuccessForCustomer, onOpen))
        } catch (err) {
            dispatch(setSessionId(""));
            setLoading(false)
            if (err.response?.data?.errorCode === 6) {
                onOpen()
            } else showError(err)
        } finally {
            setLoading(false);
        }
    }

    const handleExistingUser = () => {
        setLoading(true);
        if (currentUser && currentUser?.dealershipId === scProfile?.dealershipId) {
            getDataForAdminUser()
        } else {
            getDataForCustomer()
        }
    }

    const onComplete = async (serviceType: EServiceType, selectedUserType?: EUserType) => {
        handleConfig(serviceType);
        if (customerEnteredEmail && selectedUserType === EUserType.Existing) {
            handleExistingUser()
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
                />;
        }
    }

    const getTitle = (view: TView) => {
        return view === 'serviceCenterSelect'
            ? `${scProfile?.dealershipName} Network Service Centers`
            :  view === 'serviceSelect' ? t("Do you want to bring your car in") : null
    };
    const getSubTitle = (view: TView) => {
        return view === 'serviceSelect' ? t("Or use our mobile service?") : t("schedule service")
    };

    // todo uncomment language switcher

    return !scProfile || isProfileLoading || shortLoading
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