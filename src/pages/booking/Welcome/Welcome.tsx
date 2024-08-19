import React, {useEffect, useMemo, useState} from 'react';

import {CustomerSelect} from "../../../features/booking/CustomerSelect/CustomerSelect";
import {useHistory, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {WelcomeLayout} from "../../../features/booking/WelcomeLayout/WelcomeLayout";
import {
    clearStorage,
    getBlankCustomer,
    getBlankVehicle,
    saveCustomerCache,
    setCustomerEnteredEmail,
    setCustomerLoadedData,
    setSessionId
} from "../../../store/reducers/appointment/actions";
import {encodeSCID} from "../../../utils/utils";
import {FrameWelcomeLayout} from "../../../features/booking/FrameWelcomeLayout/FrameWelcomeLayout";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import {frameTheme} from "../../../theme/theme";
import {
    setAddress, setCurrentFrameScreen,
    setServiceTypeOption, setShowServiceCentersList,
    setSideBarSteps,
    setUserType,
    setValueServiceAvailability,
    setVehicle,
    setWelcomeScreenView, setZipCode
} from "../../../store/reducers/appointmentFrameReducer/actions";
import ServiceTypeSelect from "../../../features/booking/ServiceTypeSelect/ServiceTypeSelect";
import {EServiceType, EUserType} from "../../../store/reducers/appointmentFrameReducer/types";
import ReactGA from "react-ga4";
import {useTranslation} from "react-i18next";
import ExistingCustomerError from "../../../components/modals/booking/ExistingCustomerError/ExistingCustomerError";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {
    loadCustomersByPhoneOrEmail, setCustomerSearchData,
} from "../../../store/reducers/enhancedCustomerSearch/actions";
import ServiceCenterSelect from "../../../features/booking/ServiceCenterSelect/ServiceCenterSelect";
import {TView} from "../../../types/types";
import {useModal} from "../../../hooks/useModal/useModal";
import {useStorage} from "../../../hooks/useStorage/useStorage";
import {useLayout} from "../../../hooks/useLayout/useLayout";
import {useException} from "../../../hooks/useException/useException";
import {Routes} from "../../../routes/constants";
import {initialCustomerSearch} from "../../../store/reducers/constants";
import usePopState from "../../../hooks/usePopState/usePopState";

export const Welcome = () => {
    const {scProfile, customerEnteredEmail, isProfileLoading} = useSelector((state: RootState) => state.appointment);
    const {welcomeScreenView, serviceTypeOption, trackerData} = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {isLoading} = useSelector((state: RootState) => state.customers);
    const {shortLoading} = useSelector((state: RootState) => state.serviceCenters);

    const [loading, setLoading] = useState<boolean>(false);
    const {t} = useTranslation();
    const {isOpen, onOpen, onClose} = useModal();

    const {id} = useParams<{id: string}>();
    const history = useHistory();
    const showError = useException();
    const isFrame = useLayout();
    const dispatch = useDispatch();
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

    useStorage();

    useEffect(() => {
        setLoading(isLoading || shortLoading || isProfileLoading)
    }, [isLoading, shortLoading, isProfileLoading])

    useEffect(() => {
        clearStorage();
    }, []);

    usePopState('select');

    const redirect = () => {
        const route = isFrame ? Routes.EndUser.AppointmentFrame : Routes.EndUser.Appointment;
        if (id) {
            history.push(route.replace(":id", id));
        } else if (scProfile?.id) {
            history.push(route.replace(":id", encodeSCID(scProfile.id)));
        }
    }

    const handleValueServiceConfig = (serviceType: EServiceType) => {
        const currentConfig = config.find(item => item.serviceType.toString() === serviceType.toString());
        if (currentConfig) dispatch(setValueServiceAvailability(currentConfig.valueService));
        dispatch(setSideBarSteps([]));
    }

    const handleGA = () => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Enters Page',
            label: `As Returning Customer`,
        }, trackerData.ids);
    }

    const onSuccessForCustomer = () => {
        handleGA();
        redirect();
    }

    const getData = () => {
        try {
            setLoading(true);
            dispatch(loadCustomersByPhoneOrEmail(scProfile?.id ?? 0, showError, customerEnteredEmail, onSuccessForCustomer, onOpen))
        } catch (err: any) {
            dispatch(setSessionId(""));
            if (err.response?.data?.errorCode === 6) {
                onOpen()
            } else showError(err)
        } finally {
            setLoading(false);
        }
    }

    const skipServiceTypeSelection = () => {
        dispatch(setCurrentFrameScreen("serviceNeeds"));
        createBlankUser()
        redirect()
    }

    const handleFirstScreenOptions = () => {
        if (firstScreenOptions.length > 1) {
            dispatch(setWelcomeScreenView("serviceSelect"))
        } else {
            if (firstScreenOptions[0].type === EServiceType.VisitCenter) {
                dispatch(setServiceTypeOption(firstScreenOptions[0]))
                skipServiceTypeSelection()
            } else {
                dispatch(setWelcomeScreenView("serviceSelect"))
            }
        }
    }

    const handleFirstScreen = () => {
        if (!firstScreenOptions.length) {
            skipServiceTypeSelection()
        } else {
            handleFirstScreenOptions()
        }
    }

    const onComplete = async (serviceType: EServiceType, selectedUserType?: EUserType) => {
        handleValueServiceConfig(serviceType);
        if (customerEnteredEmail && selectedUserType === EUserType.Existing) {
            getData()
        } else {
            handleFirstScreen()
        }
    }

    const createBlankUser = () => {
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
        }, trackerData.ids);
    }

    const handleNew = () => {
        dispatch(setUserType(EUserType.New));
        handleReactGA('A New');
        dispatch(setCustomerEnteredEmail(''));
        dispatch(setCustomerSearchData(initialCustomerSearch))
        dispatch(setCustomerLoadedData(null));
        dispatch(setAddress(null));
        dispatch(setZipCode(''));
        dispatch(setShowServiceCentersList(false));
        if (firstScreenOptions.length) {
            handleFirstScreenOptions()
        } else {
            createBlankUser()
            onComplete(serviceType, EUserType.New);
        }
    }

    const getComponent = () => {
        switch (welcomeScreenView) {
            case "serviceCenterSelect":
                return <ServiceCenterSelect/>
            case "search":
            case "serviceSelect":
                return <ServiceTypeSelect loading={loading} handleValueServiceConfig={handleValueServiceConfig}/>;
            case "select":
            default:
                return <CustomerSelect
                    loading={loading || isLoading}
                    onComplete={onComplete}
                    handleNew={handleNew}
                    redirect={redirect}
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
            ? <StyledEngineProvider injectFirst>
        <ThemeProvider theme={frameTheme}>
                    <ExistingCustomerError open={isOpen} onClose={onClose} onNext={handleNew}/>
                    <FrameWelcomeLayout>
                        {/*<LanguageSwitcher/>*/}
                        {getComponent()}
                    </FrameWelcomeLayout>
                </ThemeProvider>
    </StyledEngineProvider>
            : <React.Fragment>
                <WelcomeLayout title={getTitle(welcomeScreenView)} subtitle={getSubTitle(welcomeScreenView)}>
                    {/*<LanguageSwitcher/>*/}
                    {getComponent()}
                    <ExistingCustomerError open={isOpen} onClose={onClose} onNext={handleNew}/>
                </WelcomeLayout>
            </React.Fragment>;
};