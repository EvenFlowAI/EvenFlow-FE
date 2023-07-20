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
import {useCurrentUser, useException, useLayout, useModal, useStorage} from "../../utils/hooks";
import {FrameWelcomeLayout} from "./FrameWelcomeLayout";
import {MuiThemeProvider} from "@material-ui/core";
import {frameTheme} from "../../theme/theme";
import {
    loadMakes,
    setServiceTypeOption, setShowServiceCentersList,
    setSideBarSteps,
    setUserType,
    setValueServiceAvailability,
    setVehicle,
    setWelcomeScreenView
} from "../../store/reducers/appointmentFrameReducer/actions";
import ServiceTypeSelect from "./ServiceTypeSelect";
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import ReactGA from "react-ga4";
//import ReactGA from "react-ga";
import {useTranslation} from "react-i18next";
import ExistingCustomerError from "../Modals/ExistingCustomerError/ExistingCustomerError";
import {Loading} from "../UI/Loading";
import {loadFirstScreenOptionsByQuery} from "../../store/reducers/serviceTypes/actions";
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

    useStorage();

    useEffect(() => {
       if (id) {
           if (config?.length) dispatch(loadFirstScreenOptionsByQuery(decodeSCID(id)))
           dispatch(loadMakes(decodeSCID(id)))
       }
    }, [id, config])

    useEffect(() => {
        setLoading(isLoading || shortLoading || isProfileLoading)
    }, [isLoading, shortLoading, isProfileLoading])

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
        });
    }

    const onLoadingSearchResults = (count: number) => {
        count > 0 ? onOpenSearchResults() : onOpen()
    }

    const onSuccessForCustomer = () => {
        handleGA();
        redirect();
    }

    const getDataByRole = (isAdmin: boolean) => {
        try {
            setLoading(true);
            if (isAdmin) {
                dispatch(loadCustomersBySearchTerm(scProfile?.id ?? 0, onLoadingSearchResults, showError, '', '', customerEnteredEmail))
            } else {
                dispatch(loadCustomersByPhoneOrEmail(scProfile?.id ?? 0, showError, customerEnteredEmail, onSuccessForCustomer, onOpen))
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

    const handleExistingUser = () => {
        const isAdmin = Boolean(currentUser && currentUser?.dealershipId === scProfile?.dealershipId)
        getDataByRole(isAdmin)
    }

    const skipServiceTypeSelection = () => {
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
            handleExistingUser()
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
        });
    }

    const handleNew = () => {
        dispatch(setUserType(EUserType.New));
        handleReactGA('A New');
        dispatch(setCustomerEnteredEmail(''));
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
                return <SelectServiceCenter/>
            case "search":
            case "serviceSelect":
                return <ServiceTypeSelect loading={loading} handleValueServiceConfig={handleValueServiceConfig}/>;
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