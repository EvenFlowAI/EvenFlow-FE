import React, {useMemo} from 'react';
import {Grid} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {EServiceType, EUserType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {
    getBlankCustomer,
    getBlankVehicle,
    saveCustomerCache,
    setCustomerLoadedData
} from "../../../../store/reducers/appointment/actions";
import {
    clearAppointmentData,
    setCurrentFrameScreen,
    setServiceTypeOption, setSideBarSteps, setValueServiceAvailability,
    setVehicle,
    setWelcomeScreenView
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import ReactGA from "react-ga4";
//import ReactGA from "react-ga";
import {Loading} from "../../../UI/Loading";
import {IFirstScreenOption} from "../../../../store/reducers/serviceTypes/types";
import {InfoOutlined} from "@material-ui/icons";
import {HtmlTooltip} from "../ServiceCard";
import ServiceTypeIcon from "../../../Welcome/ServiceTypeIcon";
import {Actions} from "../Actions";
import {useCurrentUser} from "../../../../utils/hooks";
import {Routes} from "../../../../config/routes";
import {encodeSCID} from "../../../../utils/utils";
import {useHistory, useParams} from "react-router-dom";
import {
    ServiceTypeButton,
    ServiceTypeCardsWrapper,
    Tagline,
    useServiceTypeStyles
} from "../../../Welcome/ServiceTypeSelect";
import serviceOption from "../SelectedAppointmentParts/ServiceOption";

const ServiceTypeSelect = () => {
    const {userType, selectedVehicle, serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions, isLoading} = useSelector((state: RootState) => state.serviceTypes);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const currentUser = useCurrentUser();

    const {id} = useParams();
    const classes = useServiceTypeStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const isTaglinePresent = useMemo(() => firstScreenOptions.find(el => el?.taglineText?.length), [firstScreenOptions]);

    const handleValueServiceConfig = (serviceType: EServiceType) => {
        const currentConfig = config.find(item => item.serviceType.toString() === serviceType.toString());
        if (currentConfig) dispatch(setValueServiceAvailability(currentConfig.valueService));
        dispatch(setSideBarSteps([]));
    }

    const handleChangeFromVisitCenter = (serviceOption: IFirstScreenOption) => {
        if (serviceOption?.type === EServiceType.MobileService || serviceOption?.type === EServiceType.PickUpDropOff) {
            dispatch(setCurrentFrameScreen("location"));
        } else {
            const newOptionHasDifferentTransportation = serviceOption.transportationOption && (serviceOption.transportationOption?.id !== serviceTypeOption?.transportationOption?.id)
            if (newOptionHasDifferentTransportation) {
                // todo message
                dispatch(setCurrentFrameScreen("appointmentSelection"))
            } else {
                // todo open window
            }
        }
    }

    const handleChangeFromOtherOption = (serviceOption: IFirstScreenOption) => {
        dispatch(setCurrentFrameScreen("location"))
        // todo If user is not in a zone of service or declines the convenience fee for the new address, bring the user back to the Address page
        // If user is in the same zone of service, then
        // Prompt user if he/she wishes to make any additional changes
        // If yes, then return user to Manage Appointment / Appointment Configuration page
        // If no, then send user to the Appointment Confirmation page
        // If user is in a different zone of service and accepted any applicable convenience fees, then
        // Message user that their selection impacts appointment date and time availability
        // Bring the user to the Appointment Date & Time selection page

    }

    const onServiceTypeSelect = (serviceOption: IFirstScreenOption) => {
        if (serviceTypeOption?.type === EServiceType.VisitCenter) {
            handleChangeFromVisitCenter(serviceOption)
        } else {
            handleChangeFromOtherOption(serviceOption)
        }
        dispatch(setServiceTypeOption(serviceOption))
        handleValueServiceConfig(serviceOption.type);
    }

    const handleSelectOption = (card: IFirstScreenOption) => {
        if (card.type === EServiceType.General) {
            if (card.externalLink) window.location.href = card.externalLink;
        } else {
            onServiceTypeSelect(card);
        }
    }

    const handleBack = () => {
        dispatch(setCurrentFrameScreen("manageAppointment"))
    }

    return isLoading
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
        </div>
};

export default ServiceTypeSelect;