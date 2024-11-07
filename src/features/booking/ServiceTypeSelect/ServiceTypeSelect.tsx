import React, {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EServiceType, EUserType} from "../../../store/reducers/appointmentFrameReducer/types";
import {
    getBlankCustomer,
    getBlankVehicle,
    saveCustomerCache,
    setCustomerLoadedData
} from "../../../store/reducers/appointment/actions";
import {
    checkCarIsValid,
    clearAppointmentData,
    loadConsultants,
    setCurrentFrameScreen,
    setServiceOptionChanged,
    setServiceTypeOption,
    setSideBarSteps,
    setTrackerCreated,
    setTransportation,
    setUsualFlowNeeded,
    setVehicle,
    setWelcomeScreenView
} from "../../../store/reducers/appointmentFrameReducer/actions";
import ReactGA from "react-ga4";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {IFirstScreenOption} from "../../../store/reducers/serviceTypes/types";
import {InfoOutlined} from "@mui/icons-material";
import ServiceTypeIcon from "./ServiceTypeIcon/ServiceTypeIcon";
import {ActionButtons} from "../ActionButtons/ActionButtons";
import {decodeSCID, encodeSCID} from "../../../utils/utils";
import {useHistory, useParams} from "react-router-dom";
import AskChangesCompleted from "../../../components/modals/booking/AskChangesCompleted/AskChangesCompleted";
import SlotImpactedWarning from "../../../components/modals/booking/SlotImpactedWarning/SlotImpactedWarning";
import {setServiceWarningOpen, setSlotsWarningOpen} from "../../../store/reducers/modals/actions";
import ServiceImpactedWarning from "../../../components/modals/booking/ServiceImpactedWarning/ServiceImpactedWarning";
import {checkPodChanged} from "../../../store/reducers/appointments/actions";
import {ServiceTypeButton, ServiceTypeCardsWrapper, Tagline, useServiceTypeStyles} from "./styles";
import {HtmlTooltip} from "../../../components/styled/HtmlTooltip";
import {useAnalyticsForParentSite} from "../../../hooks/useAnalyticsBySCId/useAnalyticsBySCId";
import {useException} from "../../../hooks/useException/useException";
import {useCurrentUser} from "../../../hooks/useCurrentUser/useCurrentUser";
import {Routes} from "../../../routes/constants";
import {useMediaQuery, useTheme} from "@mui/material";

type TProps = {
    handleValueServiceConfig: (serviceType: EServiceType) => void;
    loading: boolean;
};

const ServiceTypeSelect: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({handleValueServiceConfig, loading }) => {
    const {
        trackerData,
        userType,
        selectedVehicle,
        serviceTypeOption,
        appointmentByKey,
        address,
        zipCode,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions, isLoading} = useSelector((state: RootState) => state.serviceTypes);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {wasWarningShowed} = useSelector((state: RootState) => state.modals);
    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const currentUser = useCurrentUser();

    const {id} = useParams<{id: string}>();
    const { classes  } = useServiceTypeStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const showError = useException();
    const scId = useMemo(() => id ? id : scProfile?.id ? encodeSCID(scProfile.id) : '',
        [scProfile, id])
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("mdl"))
    const isTagLinePresent = useMemo(() => firstScreenOptions.some(el => el.taglineText), [firstScreenOptions])

    const setTracker = (ids: string[]) => dispatch(setTrackerCreated({isCreated: true, ids}))

    useEffect(() => {
        if (!firstScreenOptions.length) dispatch(setCurrentFrameScreen("serviceNeeds"));
    }, [firstScreenOptions])

    useAnalyticsForParentSite(id, trackerData.isCreated, setTracker);

    const redirect = () => {
        if (scId) {
            customerLoadedData?.isUpdating
                ? history.push(Routes.EndUser.ManageAppointmentFrame.replace(":id", scId))
                : history.push(Routes.EndUser.AppointmentFrame.replace(":id", scId));
        }
    }

    const changeToMobileOrServiceValet = () => {
        dispatch(setTransportation(null))
        dispatch(setCurrentFrameScreen("location"));
        redirect()
    }

    const redirectToTransportation = () => {
        dispatch(setCurrentFrameScreen("transportationNeeds"))
        redirect()
    }

    const handleVisitCenterSwitch = (newServiceOption: IFirstScreenOption) => {
        const newConfigHasTransportation = config
            .find(el => el.serviceType === newServiceOption.type)?.transportationNeeds
        if (newConfigHasTransportation && !newServiceOption?.transportationOption) {
            dispatch(checkPodChanged(decodeSCID(id), showError, redirectToTransportation, redirect))
        } else {
            dispatch(checkPodChanged(decodeSCID(id), showError, redirect, redirect))
        }
    }

    const changeToVisitCenter = (newServiceOption: IFirstScreenOption) => {
        if (serviceTypeOption?.type === EServiceType.MobileService && !wasWarningShowed) {
            dispatch(setServiceWarningOpen(true))
        } else if (serviceTypeOption?.type === EServiceType.PickUpDropOff && !wasWarningShowed) {
            dispatch(setSlotsWarningOpen(true))
        } else {
            handleVisitCenterSwitch(newServiceOption)
        }
    }

    const handleUpdateOption = (serviceOption: IFirstScreenOption) => {
        const requestDataIsValid = serviceOption?.type === EServiceType.VisitCenter || Boolean(address && zipCode)
        requestDataIsValid && dispatch(checkCarIsValid(() => dispatch(loadConsultants(id, serviceOption.id))))
        if (serviceOption?.type === EServiceType.VisitCenter) {
            changeToVisitCenter(serviceOption)
        } else {
            changeToMobileOrServiceValet()
        }
    }

    const onServiceTypeSelect = (newServiceOption: IFirstScreenOption) => {
        handleValueServiceConfig(newServiceOption.type);
        dispatch(setUsualFlowNeeded(false));
        if (customerLoadedData?.isUpdating) {
            handleUpdateOption(newServiceOption)
        } else {
            if (serviceTypeOption?.id !== newServiceOption.id) {
                dispatch(clearAppointmentData());
                dispatch(setServiceOptionChanged(false));
                dispatch(setSideBarSteps([]))
            }
            const nextScreen = newServiceOption.type === EServiceType.VisitCenter ? 'serviceNeeds' : 'location';
            dispatch(setCurrentFrameScreen(nextScreen));
            redirect();
        }
    }

    const createBlankUser = () => {
        const c = getBlankCustomer();
        dispatch(setCustomerLoadedData(c));
        dispatch(setVehicle(getBlankVehicle()));
        saveCustomerCache(c);
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Enters Page',
            label: `As New User`,
        }, trackerData.ids);
    }

    const handleUser = (service: IFirstScreenOption) => {
        if (userType === EUserType.New) createBlankUser();
        onServiceTypeSelect(service);
    }

    const handleSelectOption = (card: IFirstScreenOption) => {
        if (!customerLoadedData?.isUpdating) {
            dispatch(clearAppointmentData())
            dispatch(setSideBarSteps([]))
        }
        dispatch(setServiceTypeOption(card))
        if (card.type === EServiceType.General) {
            if (card.externalLink) window.location.href = card.externalLink;
        } else {
            handleUser(card);
        }
    }

    const handleBackWhileUpdating = () => {
        dispatch(setCurrentFrameScreen("manageAppointment"))
        dispatch(setWelcomeScreenView("serviceCenterSelect"))
        dispatch(setServiceTypeOption(appointmentByKey?.serviceTypeOption ?? null))
        redirect();
    }

    const handleBack = () => {
        const userIsNew = (!customerLoadedData && !selectedVehicle?.make) || userType === EUserType.New;
        if (customerLoadedData?.isUpdating) {
            handleBackWhileUpdating()
        } else {
            if (currentUser || userIsNew) {
                dispatch(setWelcomeScreenView("select"))
            } else {
                dispatch(setCurrentFrameScreen("carSelection"))
                redirect()
            }
        }
    }

    return isLoading || loading
        ? <Loading/>
        : <div className={classes.wrapper}>
            <ServiceTypeCardsWrapper cardsAmount={firstScreenOptions.length}>
                {[...firstScreenOptions]
                    .sort((a, b) => a && b ? a.orderIndex - b.orderIndex : 0)
                    .map((card) => {
                        if (card) {
                            return <div key={card.id}>
                                <ServiceTypeButton
                                    onClick={() => handleSelectOption(card)}
                                    isTaglinePresent={isMobile ? !!card.taglineText?.length : isTagLinePresent}>
                                    {card.description ? <HtmlTooltip
                                        onClick={e => e.stopPropagation()}
                                        enterTouchDelay={0}
                                        placement={isMobile ? "left-start" : "right-end"}
                                        title={<div style={isMobile ? {maxWidth: 280} : {}}>{card.description.split('\n').map(line => <p key={line}>{line}</p>)}</div>}
                                    >
                                        <div className="infoIcon"><InfoOutlined style={{ color: "#828282" }}/></div>
                                    </HtmlTooltip> : null}
                                    <div className={classes.name}>{card.name}</div>
                                    {(isMobile && card.taglineText) || isTagLinePresent ? <Tagline taglineColor={card.taglineFontColorHex}>{card.taglineText}</Tagline> : null}
                                    <ServiceTypeIcon card={card}/>
                                </ServiceTypeButton>
                            </div>
                        }
                    })}
            </ServiceTypeCardsWrapper>
            <ActionButtons onBack={handleBack} onNext={() => {}} hideNext/>
            <AskChangesCompleted />
            <SlotImpactedWarning />
            <ServiceImpactedWarning />
        </div>
};

export default ServiceTypeSelect;