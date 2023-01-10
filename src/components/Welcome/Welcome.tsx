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
    saveAppointmentReducer,
    setCustomerLoadedData,
    setSessionId
} from "../../store/reducers/appointment/actions";
import {decodeSCID, encodeSCID} from "../../utils/utils";
import {useException, useLayout} from "../../utils/hooks";
import {FrameWelcomeLayout} from "./FrameWelcomeLayout";
import {MuiThemeProvider} from "@material-ui/core";
import {frameTheme} from "../../theme/theme";
import {
    clearAppointmentData,
    setCurrentFrameScreen,
    setSideBarSteps,
    setValueServiceAvailability, setWelcomeScreenView
} from "../../store/reducers/appointmentFrameReducer/actions";
import {LocalTokens} from "../../types/types";
import {v4 as uuidv4} from "uuid";
import ServiceTypeSelect from "./ServiceTypeSelect";
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {API} from "../../api/api";
import ReactGA from "react-ga";
import {useTranslation} from "react-i18next";
import {ServiceCenterSwitcher} from "../AppointmentFlow/AppointmentFrame/ServiceCenterSwitcher/ServiceCenterSwitcher";

export const Welcome = () => {
    const {scProfile, customerEnteredEmail} = useSelector((state: RootState) => state.appointment);
    const {isMobileServiceOn, isPickUpDropOffServiceOn, welcomeScreenView, serviceType} = useSelector((state: RootState) => state.appointmentFrame);
    const { config } = useSelector((state: RootState) => state.bookingFlowConfig);

    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation();

    const {id} = useParams();
    const history = useHistory();
    const showError = useException();
    const isFrame = useLayout();
    const dispatch = useDispatch();

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
            if (err.message) {
                showError(err)
            } else {
                showError(t('could not find your vehicle'));
            }
        } finally {
            setLoading(false);
        }
    }

    const onComplete = async (serviceType: EServiceType, selectedUserType?: EUserType) => {
        handleConfig(serviceType);
        if (customerEnteredEmail && selectedUserType === EUserType.Existing) {
            handleExistingUser().then();
        } else {
            if (isMobileServiceOn || isPickUpDropOffServiceOn) {
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
                />;
        }
    }

    const getTitle = (view: TView) => view === 'serviceSelect' ? t("Do you want to bring your car in") : t("welcome");
    const getSubTitle = (view: TView) => view === 'serviceSelect' ? t("Or use our mobile service?") : t("schedule service");

    // todo uncomment language switcher

    return (isFrame ? <MuiThemeProvider theme={frameTheme}>
                <FrameWelcomeLayout>
                    <ServiceCenterSwitcher/>
                    {/*<LanguageSwitcher/>*/}
                    {getComponent()}
                </FrameWelcomeLayout>
            </MuiThemeProvider> :
            <WelcomeLayout title={getTitle(welcomeScreenView)} subtitle={getSubTitle(welcomeScreenView)}>
                {/*<LanguageSwitcher/>*/}
                <ServiceCenterSwitcher/>
                {getComponent()}
            </WelcomeLayout>
    );
};