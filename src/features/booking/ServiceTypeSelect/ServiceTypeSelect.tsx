import React, {useMemo} from 'react';
import {Grid} from "@material-ui/core";
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
//import ReactGA from "react-ga";
import {Loading} from "../../../components/Loading/Loading";
import {IFirstScreenOption} from "../../../store/reducers/serviceTypes/types";
import {InfoOutlined} from "@material-ui/icons";
import ServiceTypeIcon from "./ServiceTypeIcon/ServiceTypeIcon";
import {Actions} from "../Actions/Actions";
import {useAnalyticsBySCId, useCurrentUser, useException} from "../../../utils/hooks";
import {Routes} from "../../../config/routes";
import {decodeSCID, encodeSCID} from "../../../utils/utils";
import {useHistory, useParams} from "react-router-dom";
import AskChangesCompleted from "../../../components/modals/booking/AskChangesCompleted/AskChangesCompleted";
import SlotImpactedWarning from "../../../components/modals/booking/SlotImpactedWarning/SlotImpactedWarning";
import {setServiceWarningOpen, setSlotsWarningOpen} from "../../../store/reducers/modals/actions";
import ServiceImpactedWarning from "../../../components/modals/booking/ServiceImpactedWarning/ServiceImpactedWarning";
import {checkPodChanged} from "../../../store/reducers/appointments/actions";
import {ServiceTypeButton, ServiceTypeCardsWrapper, Tagline, useServiceTypeStyles} from "./styles";
import {HtmlTooltip} from "../../../components/styled/HtmlTooltip";

type TProps = {
    handleValueServiceConfig: (serviceType: EServiceType) => void;
    loading: boolean;
};

const ServiceTypeSelect: React.FC<TProps> = ({handleValueServiceConfig, loading }) => {
    const {
        trackerCreated,
        userType,
        selectedVehicle,
        serviceTypeOption,
        appointmentByKey
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions, isLoading} = useSelector((state: RootState) => state.serviceTypes);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const currentUser = useCurrentUser();

    const {id} = useParams();
    const classes = useServiceTypeStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const showError = useException();
    const isTaglinePresent = useMemo(() => firstScreenOptions.find(el => el?.taglineText?.length), [firstScreenOptions]);

    useAnalyticsBySCId(id, trackerCreated, () => dispatch(setTrackerCreated(true)))

    const redirect = () => {
        if (id) {
            history.push(Routes.EndUser.AppointmentFrame.replace(":id", id));
        } else if (scProfile?.id) {
            history.push(Routes.EndUser.AppointmentFrame.replace(":id", encodeSCID(scProfile.id)));
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
            dispatch(checkPodChanged(decodeSCID(id), showError, redirectToTransportation))
        } else {
            dispatch(checkPodChanged(decodeSCID(id), showError))
        }
    }

    const changeToVisitCenter = (newServiceOption: IFirstScreenOption) => {
        if (serviceTypeOption?.type === EServiceType.MobileService) {
            dispatch(setServiceWarningOpen(true))
        } else if (serviceTypeOption?.type === EServiceType.PickUpDropOff) {
            dispatch(setSlotsWarningOpen(true))
        } else {
            handleVisitCenterSwitch(newServiceOption)
        }
    }

    const handleUpdateOption = (serviceOption: IFirstScreenOption) => {
        dispatch(checkCarIsValid(() => dispatch(loadConsultants(id, serviceOption.id))))
        if (serviceOption?.type === EServiceType.VisitCenter) {
            changeToVisitCenter(serviceOption)
        } else {
            changeToMobileOrServiceValet()
        }
    }

    const onServiceTypeSelect = (serviceOption: IFirstScreenOption) => {
        handleValueServiceConfig(serviceOption.type);
        dispatch(setUsualFlowNeeded(false));
        if (customerLoadedData?.isUpdating) {
            dispatch(setTransportation(null));
            handleUpdateOption(serviceOption)
        } else {
            if (serviceTypeOption?.id !== serviceOption.id) {
                dispatch(clearAppointmentData());
                dispatch(setServiceOptionChanged(false));
                dispatch(setSideBarSteps([]))
            }
            const nextScreen = serviceOption.type === EServiceType.VisitCenter ? 'serviceNeeds' : 'location';
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
        });
    }

    const handleUser = (service: IFirstScreenOption) => {
        if (userType === EUserType.New) createBlankUser();
        onServiceTypeSelect(service);
    }

    const handleSelectOption = (card: IFirstScreenOption) => {
        if (!customerLoadedData?.isUpdating) dispatch(clearAppointmentData())
        dispatch(setServiceTypeOption(card))
        if (card.type === EServiceType.General) {
            if (card.externalLink) window.location.href = card.externalLink;
        } else {
            handleUser(card);
        }
    }

    const handleBackWhileUpdating = () => {
        dispatch(setCurrentFrameScreen("manageAppointment"))
        dispatch(setServiceTypeOption(appointmentByKey?.serviceTypeOption ?? null))
        redirect();
    }

    const handleBack = () => {
        const userIsNew = (!customerLoadedData?.id && !selectedVehicle?.make) || userType === EUserType.New;
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
                            return <Grid key={card.id}>
                                <ServiceTypeButton onClick={() => handleSelectOption(card)} isTaglinePresent={!!isTaglinePresent}>
                                    {card.description ? <HtmlTooltip
                                        enterTouchDelay={0}
                                        placement="right-end"
                                        title={<div>{card.description.split('\n').map(line => <p key={line}>{line}</p>)}</div>}
                                    >
                                        <div className="infoIcon"><InfoOutlined style={{ color: "#828282" }}/></div>
                                    </HtmlTooltip> : null}
                                    <div className={classes.name}>{card.name}</div>
                                    {isTaglinePresent ? <Tagline taglineColor={card.taglineFontColorHex}>{card.taglineText}</Tagline> : null}
                                    <ServiceTypeIcon card={card}/>
                                </ServiceTypeButton>
                            </Grid>
                        }
                    })}
            </ServiceTypeCardsWrapper>
            <Actions onBack={handleBack} onNext={() => {}} hideNext/>
            <AskChangesCompleted />
            <SlotImpactedWarning />
            <ServiceImpactedWarning />
        </div>
};

export default ServiceTypeSelect;