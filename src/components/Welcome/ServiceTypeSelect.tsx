import React, {useMemo} from 'react';
import {Grid, styled, Theme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {mh400, mh600} from "./CustomerSelect";
import {RootState} from "../../store/rootReducer";
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {
    getBlankCustomer,
    getBlankVehicle,
    saveCustomerCache,
    setCustomerLoadedData
} from "../../store/reducers/appointment/actions";
import {
    clearAppointmentData, createOrUpdateAppointment,
    setCurrentFrameScreen,
    setServiceTypeOption, setSideBarSteps, setTransportation,
    setVehicle,
    setWelcomeScreenView
} from "../../store/reducers/appointmentFrameReducer/actions";
import ReactGA from "react-ga4";
//import ReactGA from "react-ga";
import {Loading} from "../UI/Loading";
import {makeStyles} from "@material-ui/core/styles";
import {IFirstScreenOption} from "../../store/reducers/serviceTypes/types";
import {InfoOutlined} from "@material-ui/icons";
import {HtmlTooltip} from "../AppointmentFlow/AppointmentFrame/ServiceCard";
import ServiceTypeIcon from "./ServiceTypeIcon";
import {Actions} from "../AppointmentFlow/AppointmentFrame/Actions";
import {useCurrentUser, useException, useModal} from "../../utils/hooks";
import {Routes} from "../../config/routes";
import {decodeSCID, encodeSCID} from "../../utils/utils";
import {useHistory, useParams} from "react-router-dom";
import AskChangesCompleted from "../Modals/AskChangesCompleted/AskChangesCompleted";
import SlotImpactedWarning from "../Modals/SlotImpactedWarning/SlotImpactedWarning";

type TProps = {
    handleValueServiceConfig: (serviceType: EServiceType) => void;
    loading: boolean;
};

export const ServiceTypeCardsWrapper = styled(({cardsAmount, ...props}) => (<div {...props}/>))<Theme, {cardsAmount: number}>(({theme, cardsAmount}) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cardsAmount}, 1fr)`,
    gap: "18px",
    marginTop: "5%",
    marginBottom: 20,
    justifyItems: cardsAmount === 1 ? "center" : "unset",
    '& > div': {
        minWidth:   cardsAmount === 1 ? 440 : 'unset'
    },
    [mh600]: {
        marginTop: "2%"
    },
    [theme.breakpoints.down("sm")]: {
        gridTemplateRows: `repeat(${cardsAmount}, 1fr)`,
        gridTemplateColumns: '1fr',
        marginTop: theme.spacing(5)
    }
}));

export const Tagline = styled(({taglineColor, ...props}) => (<div {...props}/>))<Theme, {taglineColor?: string}>(({theme, taglineColor}) => ({
    minHeight: 40,
    width: '100%',
    display: 'flex',
    justifyContent: "center",
    fontWeight: 600,
    fontSize: 20,
    paddingBottom: 16,
    color: taglineColor ? `#${taglineColor}` : 'inherit',
}))

export const ServiceTypeButton = styled(({isTaglinePresent, ...props}) => (<div {...props}/>))<Theme, {isTaglinePresent: boolean}>(({theme, isTaglinePresent}) => ({
    position: 'relative',
    height: "100%",
    maxHeight: 285,
    //display: "flex",
    display: "grid",
    gridTemplateRows: isTaglinePresent ? '1fr 2fr 3fr' : '1fr 3fr',
    gridGap: isTaglinePresent ? 10 : 20,
    fontWeight: "bold",
    fontSize: 32,
    textAlign: "center",
    cursor: "pointer",
    padding: "10%",
    border: "1px solid #DADADA",
    background: "#FFFFFF",
    transition: theme.transitions.create(["box-shadow"]),
    "&:hover": {
        boxShadow: "0 2px 8px rgba(0,0,0,.1)"
    },
    [mh600]: {
        fontSize: 22,
        padding: "7%"
    },
    [`${mh400} and (orientation: portrait)`]: {
        fontSize: 18,
        padding: "2%"
    },
    [theme.breakpoints.down("sm")]: {
        justifyItems: 'center',
    },
    [theme.breakpoints.down("xs")]: {
        fontSize: 18,
        padding: "5% 10%"
    },
    "& .infoIcon": {
        position: 'absolute',
        top: 15,
        right: 15,
        display: 'flex',
        justifyContent: 'flex-end',
    },
}));

export const useServiceTypeStyles = makeStyles((theme) => ({
    name: {
        width: "100%",
        fontSize: 28,
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
    }
}))

const ServiceTypeSelect: React.FC<TProps> = ({handleValueServiceConfig, loading }) => {
    const {userType, selectedVehicle, serviceTypeOption, appointmentByKey} = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions, isLoading} = useSelector((state: RootState) => state.serviceTypes);
    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const currentUser = useCurrentUser();
    const showError = useException();

    const {id} = useParams();
    const classes = useServiceTypeStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const {isOpen: isChangesCompletedOpen, onClose: onChangesCompletedClose, onOpen: onChangesCompletedOpen} = useModal();
    const {isOpen: isSlotsWarningOpen, onClose: onSlotsWarningClose, onOpen: onSlotsWarningOpen} = useModal();
    const isTaglinePresent = useMemo(() => firstScreenOptions.find(el => el?.taglineText?.length), [firstScreenOptions]);

    const redirect = () => {
        if (id) {
            history.push(Routes.EndUser.AppointmentFrame.replace(":id", id));
        } else if (scProfile?.id) {
            history.push(Routes.EndUser.AppointmentFrame.replace(":id", encodeSCID(scProfile.id)));
        }
    }

    const handleChangeFromVisitCenter = (serviceOption: IFirstScreenOption) => {
        if (serviceOption?.type === EServiceType.MobileService || serviceOption?.type === EServiceType.PickUpDropOff) {
            dispatch(setTransportation(null))
            dispatch(setCurrentFrameScreen("location"));
        } else {
            // todo check for pod
            const newOptionHasDifferentTransportation = true;
            if (newOptionHasDifferentTransportation) {
                onSlotsWarningOpen()
                dispatch(setCurrentFrameScreen("appointmentSelection"))
            } else {
                onChangesCompletedOpen()
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


    const handleManaging = (serviceOption: IFirstScreenOption) => {
        if (serviceTypeOption?.type === EServiceType.VisitCenter) {
            handleChangeFromVisitCenter(serviceOption)
        } else {
            handleChangeFromOtherOption(serviceOption)
        }
    }

    const onServiceTypeSelect = (serviceOption: IFirstScreenOption) => {
        handleValueServiceConfig(serviceOption.type);
        if (customerLoadedData?.isUpdating && appointmentByKey) {
            handleManaging(serviceOption)
        } else {
            if (serviceTypeOption?.id !== serviceOption.id) {
                dispatch(clearAppointmentData());
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
        dispatch(clearAppointmentData())
        dispatch(setServiceTypeOption(card))
        if (card.type === EServiceType.General) {
            if (card.externalLink) window.location.href = card.externalLink;
        } else {
            handleUser(card);
        }
    }

    const handleBack = () => {
        const userIsNew = (!customerLoadedData?.id && !selectedVehicle?.make) || userType === EUserType.New;
        if (currentUser || userIsNew) {
            dispatch(setWelcomeScreenView("select"))
        } else {
            dispatch(setCurrentFrameScreen("carSelection"))
            redirect()
        }
    }

    const onSuccessAppointmentUpdate = () => {
        onChangesCompletedClose()
        dispatch(setCurrentFrameScreen("appointmentConfirmed"))
    }

    const handleChangesCompleted = async () => {
        dispatch(createOrUpdateAppointment(decodeSCID(id), onSuccessAppointmentUpdate, showError))
    }

    const handleAdditionalChanges = () => {
        onChangesCompletedClose()
        dispatch(setCurrentFrameScreen("manageAppointment"))
    }

    const onSlotsWarningClick = () => {
        onSlotsWarningClose();
        dispatch(setCurrentFrameScreen("appointmentSelection"));
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
            <AskChangesCompleted
                onClose={onChangesCompletedClose}
                onSave={handleChangesCompleted}
                onAdditionalChanges={handleAdditionalChanges}
                open={isChangesCompletedOpen}
            />
            <SlotImpactedWarning open={isSlotsWarningOpen} onClose={onSlotsWarningClick} onClick={onSlotsWarningClick}/>
        </div>
};

export default ServiceTypeSelect;